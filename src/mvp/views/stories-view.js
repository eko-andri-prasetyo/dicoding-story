import { StoryModel, Auth } from '../model.js';
import { StoriesPresenter } from '../../mvp/presenters/stories-presenter.js';
import { db } from '../../util/idb.js';

export class StoriesView {
  constructor() {
    this.model = new StoryModel();
    this.presenter = new StoriesPresenter(this.model, this);
  }

  render(){
    return `
      <section class="card">
        <div class="toolbar">
          <h2 style="margin-right:auto">Daftar Stories</h2>
          <label for="withLoc" class="muted" style="display:flex;gap:6px;align-items:center;">
            <input id="withLoc" type="checkbox" /> Sertakan yang ada lokasi
          </label>
          <a href="#/saved" class="button">Lihat Favorit</a>
          <button id="clearDbBtn">Hapus Cache</button>
        </div>
        <div id="status" class="muted" role="status"></div>
        <div id="list" class="list" aria-live="polite"></div>
      </section>
    `;
  }

  async afterRender(){
    if (!Auth.getToken()){
      document.getElementById('status').textContent = 'Silakan login untuk melihat stories.';
      return;
    }

    const withLoc = document.getElementById('withLoc');
    withLoc.addEventListener('change', () => this.loadStories(withLoc.checked));
    
    document.getElementById('clearDbBtn').addEventListener('click', async () => {
      await db.clear('stories');
      document.getElementById('status').textContent = 'Cache stories berhasil dihapus.';
      document.getElementById('list').innerHTML = '';
    });

    await this.loadStories(withLoc.checked);
  }

  async loadStories(withLocation = false) {
    try {
      this.showLoading();
      const data = await this.model.list({ page: 1, size: 12, location: withLocation ? 1 : 0 });
      
      // Pastikan data.listStory ada sebelum melanjutkan
      if (data && data.listStory) {
        this.renderStories(data.listStory);
      } else {
        this.renderError('Format data tidak valid');
      }
    } catch (e) {
      console.warn('Gagal fetch dari network, mencoba memuat dari IndexedDB...', e);
      const storiesFromDb = await db.getAll('stories');
      if (storiesFromDb && storiesFromDb.length > 0) {
        this.renderStories(storiesFromDb);
        document.getElementById('status').textContent = 'Menampilkan data dari cache (offline).';
      } else {
        this.renderError(e.message || 'Gagal memuat stories baik online maupun offline.');
      }
    }
  }

  showLoading(){ 
    document.getElementById('status').textContent = 'Memuat stories...'; 
  }

  async renderStories(list){
    const listEl = document.getElementById('list');
    listEl.innerHTML = '';
    
    if (!list || !list.length){ 
      listEl.innerHTML = '<p class="muted">Belum ada story.</p>'; 
      return; 
    }
    
    // Simpan ke IndexedDB untuk penggunaan offline
    try {
      await db.clear('stories');
      for (const story of list) {
        await db.put('stories', story);
      }
    } catch (e) {
      console.error('Gagal menyimpan story ke IndexedDB', e);
    }
    
    // Cek cerita yang sudah disimpan di favorit
    const savedStories = await db.getAll('savedStories');
    const savedStoryIds = savedStories.map(s => s.id);
    
    for (const s of list){
      const isSaved = savedStoryIds.includes(s.id);
      
      const el = document.createElement('article');
      el.className = 'card story-item';
      el.innerHTML = `
        <img src="${s.photoUrl}" alt="Foto story oleh ${s.name}" 
             loading="lazy" onerror="this.src='/icons/icon-192.png'"/>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <p class="muted">${new Date(s.createdAt).toLocaleString('id-ID')}</p>
        <div class="toolbar">
          <button class="save-story" data-id="${s.id}" ${isSaved ? 'disabled' : ''}>
            ${isSaved ? '✓ Tersimpan' : 'Simpan ke Favorit'}
          </button>
          <a class="button" href="#/detail/${s.id}">Detail</a>
        </div>
      `;
      listEl.appendChild(el);
    }
    
    // Tambahkan event listener untuk tombol simpan
    document.querySelectorAll('.save-story').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const story = list.find(s => s.id === id);
        if (story) {
          try {
            await db.put('savedStories', story);
            e.target.textContent = '✓ Tersimpan';
            e.target.disabled = true;
          } catch (error) {
            console.error('Gagal menyimpan cerita:', error);
            this.renderError('Gagal menyimpan cerita ke favorit');
          }
        }
      });
    });
    
    document.getElementById('status').textContent = '';
  }

  renderError(msg){ 
    document.getElementById('status').textContent = msg; 
  }
  
  destroy(){}
}
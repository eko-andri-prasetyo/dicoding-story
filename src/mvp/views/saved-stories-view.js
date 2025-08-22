import { db } from '../../util/idb.js';

export class SavedStoriesView {
  render() {
    return `
      <section class="card">
        <h2>Cerita Tersimpan</h2>
        <div id="status" class="muted" role="status"></div>
        <div id="savedList" class="list" aria-live="polite"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.loadSavedStories();
  }

  async loadSavedStories() {
    try {
      this.showLoading();
      const savedStories = await db.getAll('savedStories');
      this.renderSavedStories(savedStories);
    } catch (error) {
      this.renderError('Gagal memuat cerita tersimpan: ' + error.message);
    }
  }

  showLoading() {
    document.getElementById('status').textContent = 'Memuat cerita tersimpan...';
  }

  renderSavedStories(stories) {
    const listEl = document.getElementById('savedList');
    listEl.innerHTML = '';
    
    if (!stories || !stories.length) {
      listEl.innerHTML = '<p class="muted">Belum ada cerita yang disimpan.</p>';
      document.getElementById('status').textContent = '';
      return;
    }
    
    stories.forEach(story => {
      const el = document.createElement('article');
      el.className = 'card story-item';
      el.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto story oleh ${story.name}" 
             loading="lazy" onerror="this.src='/icons/icon-192.png'"/>
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p class="muted">${new Date(story.createdAt).toLocaleString('id-ID')}</p>
        <div class="toolbar">
          <button class="remove-saved" data-id="${story.id}">Hapus dari Favorit</button>
          <a class="button" href="#/detail/${story.id}">Baca Selengkapnya</a>
        </div>
      `;
      listEl.appendChild(el);
    });
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.remove-saved').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.removeSavedStory(id);
      });
    });
    
    document.getElementById('status').textContent = '';
  }

  async removeSavedStory(id) {
    try {
      await db.delete('savedStories', id);
      this.renderSuccess('Cerita berhasil dihapus dari favorit');
      await this.loadSavedStories(); // Muat ulang daftar
    } catch (error) {
      this.renderError('Gagal menghapus cerita: ' + error.message);
    }
  }

  renderSuccess(msg) {
    document.getElementById('status').textContent = msg;
    setTimeout(() => {
      document.getElementById('status').textContent = '';
    }, 3000);
  }

  renderError(msg) {
    document.getElementById('status').textContent = msg;
  }

  destroy() {}
}
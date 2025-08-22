import { StoryModel, Auth } from '../model.js';
import { DetailPresenter } from '../../mvp/presenters/detail-presenter.js';

export class DetailView {
  render(){
    return `
      <section class="card">
        <h2>Detail Story</h2>
        <div id="status" class="muted" role="status"></div>
        <article id="content"></article>
        <div id="map" style="height:400px;margin-top:16px;border-radius:16px;overflow:hidden" role="application" aria-label="Peta lokasi story"></div>
      </section>
    `;
  }

  async afterRender(id){
    if (!Auth.getToken()){ 
      document.getElementById('status').textContent = 'Silakan login.'; 
      return; 
    }
    const model = new StoryModel();
    this.presenter = new DetailPresenter(model, this);
    this.presenter.load(id);
  }

  showLoading(){ 
    document.getElementById('status').textContent = 'Memuat detail...'; 
  }

  async renderStory(s){
    const c = document.getElementById('content');
    c.innerHTML = `
      <img src="${s.photoUrl}" alt="Foto story oleh ${s.name}" style="max-width:100%;border-radius:16px" onerror="this.src='/icons/icon-192.png'"/>
      <h3>${s.name}</h3>
      <p>${s.description}</p>
      <p class="muted">${new Date(s.createdAt).toLocaleString('id-ID')}</p>
      ${s.lat!=null && s.lon!=null ? `<p class="muted">Lokasi: ${s.lat}, ${s.lon}</p>` : ''}
    `;
    document.getElementById('status').textContent='';

    if (s.lat != null && s.lon != null){
      const { initLeafletMap } = await import('../../util/map.js');
      this.map = initLeafletMap('map');
      const L = window.L;
      const marker = L.marker([s.lat, s.lon]).addTo(this.map);
      marker.bindPopup(`<strong>${s.name}</strong><br/>${s.description}`).openPopup();
      this.map.setView([s.lat, s.lon], 13);
    } else {
      document.getElementById('map').innerHTML = '<p class="muted">Lokasi tidak tersedia</p>';
    }
  }

  renderError(msg){ 
    document.getElementById('status').textContent = msg; 
  }

  destroy(){ 
    if (this.map && this.map.remove) this.map.remove(); 
  }
}
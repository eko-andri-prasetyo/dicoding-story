import { StoryModel, Auth } from '../model.js';
import { StoriesPresenter } from '../../mvp/presenters/stories-presenter.js';

export class MapView {
  constructor() {
    this.model = new StoryModel();
    this.presenter = new StoriesPresenter(this.model, this);
  }

  render(){
    return `
      <section class="card">
        <h2>Peta Story</h2>
        <div id="status" class="muted" role="status"></div>
        <div id="map" style="height:520px" role="application" aria-label="Peta story"></div>
      </section>
    `;
  }
  
  async afterRender(){
    if (!Auth.getToken()){ 
      document.getElementById('status').textContent = 'Login diperlukan.'; 
      return; 
    }
    
    const { initLeafletMap } = await import('../../util/map.js');
    this.map = initLeafletMap('map');
    this.markers = [];
    
    try {
      this.showLoading();
      await this.presenter.load(1, 30, true);
    } catch (e) {
      this.renderError('Gagal memuat data peta: ' + e.message);
    }
  }
  
  showLoading(){ 
    document.getElementById('status').textContent = 'Memuat peta & data...'; 
  }
  
  renderStories(list){
    if (!this.map) return;
    const L = window.L;
    
    // Clear existing markers
    if (this.markers) {
      this.markers.forEach(marker => this.map.removeLayer(marker));
    }
    this.markers = [];
    
    // Pastikan list ada dan merupakan array
    if (!list || !Array.isArray(list)) {
      this.renderError('Data stories tidak valid');
      return;
    }
    
    const storiesWithLocation = list.filter(s => s.lat != null && s.lon != null);
    
    if (storiesWithLocation.length === 0) {
      document.getElementById('status').textContent = 'Tidak ada story dengan lokasi.';
      return;
    }
    
    storiesWithLocation.forEach(s => {
      const marker = L.marker([s.lat, s.lon]).addTo(this.map);
      marker.bindPopup(`
        <img src="${s.photoUrl}" alt="Foto story oleh ${s.name}" 
             style="width:120px;height:auto;border-radius:8px" onerror="this.src='/icons/icon-192.png'"/>
        <br/>
        <strong>${s.name}</strong>
        <br/>
        ${s.description}
      `);
      this.markers.push(marker);
    });
    
    // Fit map to show all markers
    if (storiesWithLocation.length > 0) {
      const group = new L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
    
    document.getElementById('status').textContent = '';
  }
  
  renderError(msg){ 
    document.getElementById('status').textContent = msg; 
  }
  
  destroy(){ 
    if (this.map && this.map.remove) this.map.remove(); 
    this.markers = [];
  }
}
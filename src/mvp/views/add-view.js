import { StoryModel, Auth } from '../model.js';
import { AddPresenter } from '../../mvp/presenters/add-presenter.js';

export class AddView {
  render(){
    return `
      <section class="card grid cols-2" style="align-items:start">
        <div>
          <h2>Buat Story Baru</h2>
          <form aria-label="Form Story Baru">
            <label for="description">Deskripsi</label>
            <textarea id="description" rows="5" required aria-required="true" placeholder="Tulis cerita kamu..."></textarea>
            <label for="photoInput">Unggah Foto (opsional jika pakai kamera)</label>
            <input id="photoInput" type="file" accept="image/*"/>
            <div class="toolbar">
              <button id="useCameraBtn" type="button">Gunakan Kamera</button>
              <button id="stopCameraBtn" type="button" class="hidden">Matikan Kamera</button>
            </div>
            <div class="toolbar">
              <button id="submitBtn" type="submit">Kirim Story</button>
            </div>
            <div id="status" class="muted" role="status"></div>
          </form>
        </div>
        <div>
          <div class="card" style="padding:0">
            <video id="video" autoplay playsinline style="width:100%;border-radius:16px" aria-label="Pratinjau kamera"></video>
            <canvas id="canvas" class="hidden" aria-hidden="true"></canvas>
          </div>
          <div id="map" role="application" aria-label="Peta pilih lokasi"></div>
          <p class="muted">Klik pada peta untuk memilih lokasi. Koordinat: <span id="coord">-</span></p>
        </div>
      </section>
    `;
  }
  async afterRender(){
    if (!Auth.getToken()){ document.getElementById('status').textContent = 'Login diperlukan.'; return; }
    const model = new StoryModel();
    this.presenter = new AddPresenter(model, this);
    this.stream = null;
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.photoInput = document.getElementById('photoInput');
    this.coord = { lat: null, lon: null };

    const { initLeafletMap } = await import('../../util/map.js');
    this.map = initLeafletMap('map', ({ lat, lon }) => {
      this.coord = { lat, lon };
      document.getElementById('coord').textContent = lat.toFixed(5) + ', ' + lon.toFixed(5);
    });

    const useBtn = document.getElementById('useCameraBtn');
    const stopBtn = document.getElementById('stopCameraBtn');
    useBtn.addEventListener('click', ()=> this.startCamera().then(()=>{
      useBtn.classList.add('hidden'); stopBtn.classList.remove('hidden');
    }));
    stopBtn.addEventListener('click', ()=> { this.stopCamera(); stopBtn.classList.add('hidden'); useBtn.classList.remove('hidden'); });

    const form = document.querySelector('form');
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const description = document.getElementById('description').value.trim();
      let photoBlob = null;

      if (this.stream){
        const w = this.video.videoWidth || 640, h = this.video.videoHeight || 480;
        this.canvas.width = w; this.canvas.height = h;
        const ctx = this.canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, w, h);
        const blob = await new Promise(res => this.canvas.toBlob(res, 'image/jpeg', 0.9));
        photoBlob = blob;
      } else if (this.photoInput.files[0]) {
        photoBlob = this.photoInput.files[0];
      } else {
        this.renderError('Foto diperlukan: gunakan kamera atau unggah berkas.');
        return;
      }

      await this.presenter.create({ description, photoBlob, lat: this.coord.lat, lon: this.coord.lon });
      location.hash = '#/stories';
    });
  }
  async startCamera(){
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    this.video.srcObject = this.stream;
  }
  stopCamera(){
    if (this.stream){
      for (const tr of this.stream.getTracks()) tr.stop();
      this.stream = null;
      this.video.srcObject = null;
    }
  }
  showLoading(){ document.getElementById('status').textContent = 'Mengirim...'; }
  renderSuccess(msg){ document.getElementById('status').textContent = msg; }
  renderError(msg){ document.getElementById('status').textContent = msg; }
  destroy(){
    this.stopCamera();
    if (this.map && this.map.remove) this.map.remove();
  }
}
export class AddPresenter {
  constructor(model, view){ this.model = model; this.view = view; }
  async create({ description, photoBlob, lat, lon }){
    try {
      this.view.showLoading();
      await this.model.add({ description, photoBlob, lat, lon });
      this.view.renderSuccess('Story berhasil dibuat');
      
      // Send push notification to other users via service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          // Kirim message ke service worker
          registration.active.postMessage({
            type: 'NEW_STORY',
            title: 'Story Baru',
            message: `Story baru: ${description.substring(0, 50)}...`
          });
          
          // Juga tampilkan notifikasi lokal
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Story Baru', {
              body: `Anda telah membuat story baru: ${description.substring(0, 50)}...`,
              icon: '/icons/icon-192.png'
            });
          }
        });
      }
    } catch (e){
      this.view.renderError(e.message || 'Gagal membuat story');
    }
  }
}
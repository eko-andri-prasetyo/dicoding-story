export class StoriesPresenter {
  constructor(model, view){ 
    this.model = model; 
    this.view = view; 
  }
  
  async load(page=1, size=12, withLocation=false){
    try {
      this.view.showLoading();
      const data = await this.model.list({ page, size, location: withLocation ? 1 : 0 });
      
      // Pastikan data.listStory ada sebelum melanjutkan
      if (data && data.listStory) {
        this.view.renderStories(data.listStory);
      } else {
        this.view.renderError('Format data tidak valid');
      }
    } catch (e){
      console.error('Error loading stories:', e);
      this.view.renderError(e.message || 'Gagal memuat stories');
      throw e; // Lempar error kembali untuk ditangani oleh view
    }
  }
}
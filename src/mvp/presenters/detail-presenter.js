export class DetailPresenter {
  constructor(model, view){ this.model = model; this.view = view; }
  async load(id){
    try {
      this.view.showLoading();
      const { story } = await this.model.detail(id);
      this.view.renderStory(story);
    } catch (e){
      this.view.renderError(e.message || 'Gagal memuat detail');
    }
  }
}
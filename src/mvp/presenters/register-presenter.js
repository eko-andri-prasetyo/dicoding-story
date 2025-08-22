export class RegisterPresenter {
  constructor(model, view){ this.model = model; this.view = view; }
  async doRegister(name, email, password){
    try {
      this.view.showLoading();
      await this.model.register({ name, email, password });
      this.view.renderSuccess('Registrasi berhasil. Silakan login.');
    } catch (e){
      this.view.renderError(e.message || 'Registrasi gagal');
    }
  }
}
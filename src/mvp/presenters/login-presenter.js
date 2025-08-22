import { Auth } from '../model.js';

export class LoginPresenter {
  constructor(model, view){
    this.model = model; this.view = view;
  }
  async doLogin(email, password){
    try {
      this.view.showLoading();
      const data = await this.model.login({ email, password });
      const { token } = data.loginResult || {};
      if (!token) throw new Error('Token tidak ditemukan');
      Auth.setToken(token);
      this.view.renderSuccess('Login berhasil');
    } catch (e){
      this.view.renderError(e.message || 'Login gagal');
    }
  }
}
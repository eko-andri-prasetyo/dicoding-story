import { StoryModel } from '../model.js';
import { RegisterPresenter } from '../../mvp/presenters/register-presenter.js';

export class RegisterView {
  render(){
    return `
      <section class="card">
        <h2>Registrasi</h2>
        <form aria-label="Form Registrasi">
          <label for="name">Nama</label>
          <input id="name" placeholder="Nama lengkap" required aria-required="true"/>
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="email@contoh.com" required aria-required="true"/>
          <label for="password">Password</label>
          <input id="password" type="password" placeholder="Minimal 8 karakter" required aria-required="true"/>
          <button type="submit">Daftar</button>
        </form>
        <div id="status" class="muted" role="status"></div>
      </section>
    `;
  }
  afterRender(){
    const model = new StoryModel();
    this.presenter = new RegisterPresenter(model, this);
    const form = document.querySelector('form');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      this.presenter.doRegister(name, email, password);
    });
  }
  showLoading(){ document.getElementById('status').textContent = 'Mendaftarkan...'; }
  renderSuccess(msg){ document.getElementById('status').textContent = msg; }
  renderError(msg){ document.getElementById('status').textContent = msg; }
  destroy(){}
}
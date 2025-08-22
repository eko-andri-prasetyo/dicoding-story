import { StoryModel, Auth } from '../model.js';
import { LoginPresenter } from '../../mvp/presenters/login-presenter.js';
import { syncAuthUI } from '../../app/main.js';

export class LoginView {
  render(){
    return `
      <section class="card">
        <h2>Login</h2>
        <form aria-label="Form Login">
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="email@contoh.com" required aria-required="true"/>
          <label for="password">Password</label>
          <input id="password" type="password" placeholder="Minimal 8 karakter" required aria-required="true"/>
          <button id="loginBtn" type="submit">Masuk</button>
        </form>
        <p class="muted">Belum punya akun? <a href="#/register">Daftar</a></p>
        <div id="status" class="muted" role="status"></div>
      </section>
    `;
  }
  afterRender(){
    const model = new StoryModel();
    this.presenter = new LoginPresenter(model, this);
    const form = document.querySelector('form');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      this.presenter.doLogin(email, password).then(()=>{
        syncAuthUI();
        location.hash = '#/stories';
      });
    });
  }
  showLoading(){ document.getElementById('status').textContent = 'Memproses login...'; }
  renderSuccess(msg){ document.getElementById('status').textContent = msg; }
  renderError(msg){ document.getElementById('status').textContent = msg; }
  destroy(){}
}
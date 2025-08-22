export class HomeView {
  render(){
    return `
      <section class="card">
        <h1>Selamat datang di Dicoding Story</h1>
        <p>Aplikasi SPA dengan arsitektur <strong>MVP</strong>, <strong>hash routing</strong>, akses <strong>kamera</strong>, dan <strong>peta</strong>.</p>
        <p>Mulai dari <a href="#/stories">daftar stories</a> atau <a href="#/login">login</a>.</p>
      </section>
    `;
  }
  afterRender(){}
  destroy(){}
}
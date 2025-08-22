export class NotFoundView {
  render(){
    return `
      <section class="card">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada. Mungkin Anda salah mengetik alamat?</p>
        <p>Kembali ke <a href="#/">halaman utama</a>.</p>
      </section>
    `;
  }
  afterRender(){}
  destroy(){}
}
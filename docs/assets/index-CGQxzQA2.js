const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/map-D3KO3WOm.js","assets/vendor-zdHhRoWp.js","assets/map-CIGW-MKW.css"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();class C{render(){return`
      <section class="card">
        <h1>Selamat datang di Dicoding Story</h1>
        <p>Aplikasi SPA dengan arsitektur <strong>MVP</strong>, <strong>hash routing</strong>, akses <strong>kamera</strong>, dan <strong>peta</strong>.</p>
        <p>Mulai dari <a href="#/stories">daftar stories</a> atau <a href="#/login">login</a>.</p>
      </section>
    `}afterRender(){}destroy(){}}const k="https://story-api.dicoding.dev/v1";class m{static getToken(){return localStorage.getItem("token")}static setToken(e){localStorage.setItem("token",e)}static logout(){localStorage.removeItem("token")}}class x{static async subscribe(){if(!("serviceWorker"in navigator)||!("PushManager"in window))return console.warn("Push messaging is not supported"),null;try{if(await Notification.requestPermission()!=="granted")return console.warn("Notification permission not granted"),null;const a=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array("BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk")});return await this.sendSubscriptionToServer(a),a}catch(e){return console.error("Failed to subscribe the user: ",e),null}}static async sendSubscriptionToServer(e){try{if(!e)throw console.error("Subscription is null or undefined"),new Error("Subscription object is invalid");const t=this.arrayBufferToBase64(e.getKey("p256dh")),a=this.arrayBufferToBase64(e.getKey("auth")),r={endpoint:e.endpoint,keys:{p256dh:t,auth:a}};console.log("Sending subscription to server:",r);const s=await fetch(k+"/notifications/subscribe",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+m.getToken()},body:JSON.stringify(r)});if(!s.ok){const i=await s.text();throw console.error("Server response error:",i),new Error("Failed to send subscription to server: "+s.status)}const n=await s.json();console.log("Subscription sent to server successfully:",n)}catch(t){throw console.error("Error sending subscription to server:",t),t}}static urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),a=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=window.atob(a),s=new Uint8Array(r.length);for(let n=0;n<r.length;++n)s[n]=r.charCodeAt(n);return s}static arrayBufferToBase64(e){if(!e)return"";const t=[],a=new Uint8Array(e),r=a.byteLength;for(let s=0;s<r;s++)t.push(String.fromCharCode(a[s]));return window.btoa(t.join(""))}}async function v(o,{auth:e=!1,method:t="GET",headers:a={},body:r}={}){const s=new Headers(a);if(e){const d=m.getToken();d&&s.set("Authorization","Bearer "+d)}r&&!(r instanceof FormData)&&s.set("Content-Type","application/json");const n=await fetch(k+o,{method:t,headers:s,body:r instanceof FormData?r:JSON.stringify(r)});let i;try{i=await n.json()}catch(d){i={},console.error("Error parsing JSON response:",d)}if(!n.ok||i.error){const d=i.message||n.statusText||"Permintaan gagal";throw new Error(d)}return i}class y{async register({name:e,email:t,password:a}){return v("/register",{method:"POST",body:{name:e,email:t,password:a}})}async login({email:e,password:t}){return v("/login",{method:"POST",body:{email:e,password:t}})}async list({page:e=1,size:t=10,location:a=0}={}){const r=new URLSearchParams({page:e.toString(),size:t.toString(),location:a.toString()});return v("/stories?"+r.toString(),{auth:!0})}async detail(e){return v("/stories/"+e,{auth:!0})}async add({description:e,photoBlob:t,lat:a=null,lon:r=null}){const s=new FormData;return s.append("description",e),s.append("photo",t,"photo.jpg"),a!=null&&s.append("lat",a.toString()),r!=null&&s.append("lon",r.toString()),v("/stories",{auth:!0,method:"POST",body:s})}}class P{constructor(e,t){this.model=e,this.view=t}async doLogin(e,t){try{this.view.showLoading();const a=await this.model.login({email:e,password:t}),{token:r}=a.loginResult||{};if(!r)throw new Error("Token tidak ditemukan");m.setToken(r),this.view.renderSuccess("Login berhasil")}catch(a){this.view.renderError(a.message||"Login gagal")}}}class M{render(){return`
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
    `}afterRender(){const e=new y;this.presenter=new P(e,this),document.querySelector("form").addEventListener("submit",a=>{a.preventDefault();const r=document.getElementById("email").value.trim(),s=document.getElementById("password").value;this.presenter.doLogin(r,s).then(()=>{E(),location.hash="#/stories"})})}showLoading(){document.getElementById("status").textContent="Memproses login..."}renderSuccess(e){document.getElementById("status").textContent=e}renderError(e){document.getElementById("status").textContent=e}destroy(){}}class D{constructor(e,t){this.model=e,this.view=t}async doRegister(e,t,a){try{this.view.showLoading(),await this.model.register({name:e,email:t,password:a}),this.view.renderSuccess("Registrasi berhasil. Silakan login.")}catch(r){this.view.renderError(r.message||"Registrasi gagal")}}}class A{render(){return`
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
    `}afterRender(){const e=new y;this.presenter=new D(e,this),document.querySelector("form").addEventListener("submit",a=>{a.preventDefault();const r=document.getElementById("name").value.trim(),s=document.getElementById("email").value.trim(),n=document.getElementById("password").value;this.presenter.doRegister(r,s,n)})}showLoading(){document.getElementById("status").textContent="Mendaftarkan..."}renderSuccess(e){document.getElementById("status").textContent=e}renderError(e){document.getElementById("status").textContent=e}destroy(){}}class B{constructor(e,t){this.model=e,this.view=t}async load(e=1,t=12,a=!1){try{this.view.showLoading();const r=await this.model.list({page:e,size:t,location:a?1:0});r&&r.listStory?this.view.renderStories(r.listStory):this.view.renderError("Format data tidak valid")}catch(r){throw console.error("Error loading stories:",r),this.view.renderError(r.message||"Gagal memuat stories"),r}}}const $="dicoding-story-db",R=2,w={STORIES:"stories",SAVED_STORIES:"savedStories"};function f(){return new Promise((o,e)=>{const t=indexedDB.open($,R);t.onerror=a=>{e("Error saat membuka IndexedDB: "+a.target.errorCode)},t.onsuccess=a=>{o(a.target.result)},t.onupgradeneeded=a=>{const r=a.target.result;r.objectStoreNames.contains(w.STORIES)||r.createObjectStore(w.STORIES,{keyPath:"id"}),r.objectStoreNames.contains(w.SAVED_STORIES)||r.createObjectStore(w.SAVED_STORIES,{keyPath:"id"})}})}const h={async get(o,e){const t=await f();return new Promise((a,r)=>{const i=t.transaction(o,"readonly").objectStore(o).get(e);i.onsuccess=()=>a(i.result),i.onerror=()=>r(i.error)})},async getAll(o){const e=await f();return new Promise((t,a)=>{const n=e.transaction(o,"readonly").objectStore(o).getAll();n.onsuccess=()=>t(n.result),n.onerror=()=>a(n.error)})},async put(o,e){const t=await f();return new Promise((a,r)=>{const i=t.transaction(o,"readwrite").objectStore(o).put(e);i.onsuccess=()=>a(i.result),i.onerror=()=>r(i.error)})},async delete(o,e){const t=await f();return new Promise((a,r)=>{const i=t.transaction(o,"readwrite").objectStore(o).delete(e);i.onsuccess=()=>a(),i.onerror=()=>r(i.error)})},async clear(o){const e=await f();return new Promise((t,a)=>{const n=e.transaction(o,"readwrite").objectStore(o).clear();n.onsuccess=()=>t(),n.onerror=()=>a(n.error)})}};class O{constructor(){this.model=new y,this.presenter=new B(this.model,this)}render(){return`
      <section class="card">
        <div class="toolbar">
          <h2 style="margin-right:auto">Daftar Stories</h2>
          <label for="withLoc" class="muted" style="display:flex;gap:6px;align-items:center;">
            <input id="withLoc" type="checkbox" /> Sertakan yang ada lokasi
          </label>
          <a href="#/saved" class="button">Lihat Favorit</a>
          <button id="clearDbBtn">Hapus Cache</button>
        </div>
        <div id="status" class="muted" role="status"></div>
        <div id="list" class="list" aria-live="polite"></div>
      </section>
    `}async afterRender(){if(!m.getToken()){document.getElementById("status").textContent="Silakan login untuk melihat stories.";return}const e=document.getElementById("withLoc");e.addEventListener("change",()=>this.loadStories(e.checked)),document.getElementById("clearDbBtn").addEventListener("click",async()=>{await h.clear("stories"),document.getElementById("status").textContent="Cache stories berhasil dihapus.",document.getElementById("list").innerHTML=""}),await this.loadStories(e.checked)}async loadStories(e=!1){try{this.showLoading();const t=await this.model.list({page:1,size:12,location:e?1:0});t&&t.listStory?this.renderStories(t.listStory):this.renderError("Format data tidak valid")}catch(t){console.warn("Gagal fetch dari network, mencoba memuat dari IndexedDB...",t);const a=await h.getAll("stories");a&&a.length>0?(this.renderStories(a),document.getElementById("status").textContent="Menampilkan data dari cache (offline)."):this.renderError(t.message||"Gagal memuat stories baik online maupun offline.")}}showLoading(){document.getElementById("status").textContent="Memuat stories..."}async renderStories(e){const t=document.getElementById("list");if(t.innerHTML="",!e||!e.length){t.innerHTML='<p class="muted">Belum ada story.</p>';return}try{await h.clear("stories");for(const s of e)await h.put("stories",s)}catch(s){console.error("Gagal menyimpan story ke IndexedDB",s)}const r=(await h.getAll("savedStories")).map(s=>s.id);for(const s of e){const n=r.includes(s.id),i=document.createElement("article");i.className="card story-item",i.innerHTML=`
        <img src="${s.photoUrl}" alt="Foto story oleh ${s.name}" 
             loading="lazy" onerror="this.src='/icons/icon-192.png'"/>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
        <p class="muted">${new Date(s.createdAt).toLocaleString("id-ID")}</p>
        <div class="toolbar">
          <button class="save-story" data-id="${s.id}" ${n?"disabled":""}>
            ${n?"✓ Tersimpan":"Simpan ke Favorit"}
          </button>
          <a class="button" href="#/detail/${s.id}">Detail</a>
        </div>
      `,t.appendChild(i)}document.querySelectorAll(".save-story").forEach(s=>{s.addEventListener("click",async n=>{const i=n.target.dataset.id,d=e.find(u=>u.id===i);if(d)try{await h.put("savedStories",d),n.target.textContent="✓ Tersimpan",n.target.disabled=!0}catch(u){console.error("Gagal menyimpan cerita:",u),this.renderError("Gagal menyimpan cerita ke favorit")}})}),document.getElementById("status").textContent=""}renderError(e){document.getElementById("status").textContent=e}destroy(){}}const _="modulepreload",q=function(o){return"/dicoding-story/"+o},S={},b=function(e,t,a){let r=Promise.resolve();if(t&&t.length>0){let u=function(c){return Promise.all(c.map(p=>Promise.resolve(p).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};var n=u;document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),d=i?.nonce||i?.getAttribute("nonce");r=u(t.map(c=>{if(c=q(c),c in S)return;S[c]=!0;const p=c.endsWith(".css"),g=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${g}`))return;const l=document.createElement("link");if(l.rel=p?"stylesheet":_,p||(l.as="script"),l.crossOrigin="",l.href=c,d&&l.setAttribute("nonce",d),document.head.appendChild(l),p)return new Promise((I,T)=>{l.addEventListener("load",I),l.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${c}`)))})}))}function s(i){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=i,window.dispatchEvent(d),!d.defaultPrevented)throw i}return r.then(i=>{for(const d of i||[])d.status==="rejected"&&s(d.reason);return e().catch(s)})};class V{constructor(e,t){this.model=e,this.view=t}async create({description:e,photoBlob:t,lat:a,lon:r}){try{this.view.showLoading(),await this.model.add({description:e,photoBlob:t,lat:a,lon:r}),this.view.renderSuccess("Story berhasil dibuat"),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(s=>{s.active.postMessage({type:"NEW_STORY",title:"Story Baru",message:`Story baru: ${e.substring(0,50)}...`}),"Notification"in window&&Notification.permission==="granted"&&new Notification("Story Baru",{body:`Anda telah membuat story baru: ${e.substring(0,50)}...`,icon:"/icons/icon-192.png"})})}catch(s){this.view.renderError(s.message||"Gagal membuat story")}}}class N{render(){return`
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
    `}async afterRender(){if(!m.getToken()){document.getElementById("status").textContent="Login diperlukan.";return}const e=new y;this.presenter=new V(e,this),this.stream=null,this.video=document.getElementById("video"),this.canvas=document.getElementById("canvas"),this.photoInput=document.getElementById("photoInput"),this.coord={lat:null,lon:null};const{initLeafletMap:t}=await b(async()=>{const{initLeafletMap:n}=await import("./map-D3KO3WOm.js");return{initLeafletMap:n}},__vite__mapDeps([0,1,2]));this.map=t("map",({lat:n,lon:i})=>{this.coord={lat:n,lon:i},document.getElementById("coord").textContent=n.toFixed(5)+", "+i.toFixed(5)});const a=document.getElementById("useCameraBtn"),r=document.getElementById("stopCameraBtn");a.addEventListener("click",()=>this.startCamera().then(()=>{a.classList.add("hidden"),r.classList.remove("hidden")})),r.addEventListener("click",()=>{this.stopCamera(),r.classList.add("hidden"),a.classList.remove("hidden")}),document.querySelector("form").addEventListener("submit",async n=>{n.preventDefault();const i=document.getElementById("description").value.trim();let d=null;if(this.stream){const u=this.video.videoWidth||640,c=this.video.videoHeight||480;this.canvas.width=u,this.canvas.height=c,this.canvas.getContext("2d").drawImage(this.video,0,0,u,c),d=await new Promise(l=>this.canvas.toBlob(l,"image/jpeg",.9))}else if(this.photoInput.files[0])d=this.photoInput.files[0];else{this.renderError("Foto diperlukan: gunakan kamera atau unggah berkas.");return}await this.presenter.create({description:i,photoBlob:d,lat:this.coord.lat,lon:this.coord.lon}),location.hash="#/stories"})}async startCamera(){this.stream=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1}),this.video.srcObject=this.stream}stopCamera(){if(this.stream){for(const e of this.stream.getTracks())e.stop();this.stream=null,this.video.srcObject=null}}showLoading(){document.getElementById("status").textContent="Mengirim..."}renderSuccess(e){document.getElementById("status").textContent=e}renderError(e){document.getElementById("status").textContent=e}destroy(){this.stopCamera(),this.map&&this.map.remove&&this.map.remove()}}class F{constructor(){this.model=new y,this.presenter=new B(this.model,this)}render(){return`
      <section class="card">
        <h2>Peta Story</h2>
        <div id="status" class="muted" role="status"></div>
        <div id="map" style="height:520px" role="application" aria-label="Peta story"></div>
      </section>
    `}async afterRender(){if(!m.getToken()){document.getElementById("status").textContent="Login diperlukan.";return}const{initLeafletMap:e}=await b(async()=>{const{initLeafletMap:t}=await import("./map-D3KO3WOm.js");return{initLeafletMap:t}},__vite__mapDeps([0,1,2]));this.map=e("map"),this.markers=[];try{this.showLoading(),await this.presenter.load(1,30,!0)}catch(t){this.renderError("Gagal memuat data peta: "+t.message)}}showLoading(){document.getElementById("status").textContent="Memuat peta & data..."}renderStories(e){if(!this.map)return;const t=window.L;if(this.markers&&this.markers.forEach(r=>this.map.removeLayer(r)),this.markers=[],!e||!Array.isArray(e)){this.renderError("Data stories tidak valid");return}const a=e.filter(r=>r.lat!=null&&r.lon!=null);if(a.length===0){document.getElementById("status").textContent="Tidak ada story dengan lokasi.";return}if(a.forEach(r=>{const s=t.marker([r.lat,r.lon]).addTo(this.map);s.bindPopup(`
        <img src="${r.photoUrl}" alt="Foto story oleh ${r.name}" 
             style="width:120px;height:auto;border-radius:8px" onerror="this.src='/icons/icon-192.png'"/>
        <br/>
        <strong>${r.name}</strong>
        <br/>
        ${r.description}
      `),this.markers.push(s)}),a.length>0){const r=new t.featureGroup(this.markers);this.map.fitBounds(r.getBounds().pad(.1))}document.getElementById("status").textContent=""}renderError(e){document.getElementById("status").textContent=e}destroy(){this.map&&this.map.remove&&this.map.remove(),this.markers=[]}}class j{constructor(e,t){this.model=e,this.view=t}async load(e){try{this.view.showLoading();const{story:t}=await this.model.detail(e);this.view.renderStory(t)}catch(t){this.view.renderError(t.message||"Gagal memuat detail")}}}class H{render(){return`
      <section class="card">
        <h2>Detail Story</h2>
        <div id="status" class="muted" role="status"></div>
        <article id="content"></article>
        <div id="map" style="height:400px;margin-top:16px;border-radius:16px;overflow:hidden" role="application" aria-label="Peta lokasi story"></div>
      </section>
    `}async afterRender(e){if(!m.getToken()){document.getElementById("status").textContent="Silakan login.";return}const t=new y;this.presenter=new j(t,this),this.presenter.load(e)}showLoading(){document.getElementById("status").textContent="Memuat detail..."}async renderStory(e){const t=document.getElementById("content");if(t.innerHTML=`
      <img src="${e.photoUrl}" alt="Foto story oleh ${e.name}" style="max-width:100%;border-radius:16px" onerror="this.src='/icons/icon-192.png'"/>
      <h3>${e.name}</h3>
      <p>${e.description}</p>
      <p class="muted">${new Date(e.createdAt).toLocaleString("id-ID")}</p>
      ${e.lat!=null&&e.lon!=null?`<p class="muted">Lokasi: ${e.lat}, ${e.lon}</p>`:""}
    `,document.getElementById("status").textContent="",e.lat!=null&&e.lon!=null){const{initLeafletMap:a}=await b(async()=>{const{initLeafletMap:n}=await import("./map-D3KO3WOm.js");return{initLeafletMap:n}},__vite__mapDeps([0,1,2]));this.map=a("map"),window.L.marker([e.lat,e.lon]).addTo(this.map).bindPopup(`<strong>${e.name}</strong><br/>${e.description}`).openPopup(),this.map.setView([e.lat,e.lon],13)}else document.getElementById("map").innerHTML='<p class="muted">Lokasi tidak tersedia</p>'}renderError(e){document.getElementById("status").textContent=e}destroy(){this.map&&this.map.remove&&this.map.remove()}}class U{render(){return`
      <section class="card">
        <h1>404 - Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak ada. Mungkin Anda salah mengetik alamat?</p>
        <p>Kembali ke <a href="#/">halaman utama</a>.</p>
      </section>
    `}afterRender(){}destroy(){}}class G{render(){return`
      <section class="card">
        <h2>Cerita Tersimpan</h2>
        <div id="status" class="muted" role="status"></div>
        <div id="savedList" class="list" aria-live="polite"></div>
      </section>
    `}async afterRender(){await this.loadSavedStories()}async loadSavedStories(){try{this.showLoading();const e=await h.getAll("savedStories");this.renderSavedStories(e)}catch(e){this.renderError("Gagal memuat cerita tersimpan: "+e.message)}}showLoading(){document.getElementById("status").textContent="Memuat cerita tersimpan..."}renderSavedStories(e){const t=document.getElementById("savedList");if(t.innerHTML="",!e||!e.length){t.innerHTML='<p class="muted">Belum ada cerita yang disimpan.</p>',document.getElementById("status").textContent="";return}e.forEach(a=>{const r=document.createElement("article");r.className="card story-item",r.innerHTML=`
        <img src="${a.photoUrl}" alt="Foto story oleh ${a.name}" 
             loading="lazy" onerror="this.src='/icons/icon-192.png'"/>
        <h3>${a.name}</h3>
        <p>${a.description}</p>
        <p class="muted">${new Date(a.createdAt).toLocaleString("id-ID")}</p>
        <div class="toolbar">
          <button class="remove-saved" data-id="${a.id}">Hapus dari Favorit</button>
          <a class="button" href="#/detail/${a.id}">Baca Selengkapnya</a>
        </div>
      `,t.appendChild(r)}),document.querySelectorAll(".remove-saved").forEach(a=>{a.addEventListener("click",r=>{const s=r.target.dataset.id;this.removeSavedStory(s)})}),document.getElementById("status").textContent=""}async removeSavedStory(e){try{await h.delete("savedStories",e),this.renderSuccess("Cerita berhasil dihapus dari favorit"),await this.loadSavedStories()}catch(t){this.renderError("Gagal menghapus cerita: "+t.message)}}renderSuccess(e){document.getElementById("status").textContent=e,setTimeout(()=>{document.getElementById("status").textContent=""},3e3)}renderError(e){document.getElementById("status").textContent=e}destroy(){}}class W{constructor(e){this.root=e,this.currentView=null,this.routes=[{path:/^#\/$|^#$/,view:C},{path:/^#\/login$/,view:M},{path:/^#\/register$/,view:A},{path:/^#\/stories$/,view:O},{path:/^#\/saved$/,view:G},{path:/^#\/add$/,view:N},{path:/^#\/map$/,view:F},{path:/^#\/detail\/(.+)$/,view:H}]}navigate(e){try{const t=this.routes.find(n=>n.path.test(e)),a=t&&(e.match(t.path)||[]).slice(1),r=t?t.view:U,s=()=>{try{this.currentView?.destroy&&this.currentView.destroy(),this.currentView=new r,this.root.innerHTML=this.currentView.render(),this.currentView.afterRender&&this.currentView.afterRender(...a||[])}catch(n){console.error("Error rendering view:",n),this.root.innerHTML='<div class="card"><h2>Error</h2><p>Terjadi kesalahan saat memuat halaman.</p></div>'}};document.startViewTransition?document.startViewTransition(s):s()}catch(t){console.error("Navigation error:",t),this.root.innerHTML='<div class="card"><h2>Error</h2><p>Terjadi kesalahan navigasi.</p></div>'}}}const K=new W(document.getElementById("main"));async function E(){const o=m.getToken(),e=document.getElementById("loginLink"),t=document.getElementById("logoutBtn");if(o){if(e.classList.add("hidden"),t.classList.remove("hidden"),"serviceWorker"in navigator&&"PushManager"in window)try{await x.subscribe()&&console.log("User is subscribed to push notifications")}catch(a){console.error("Failed to subscribe to push notifications:",a)}}else e.classList.remove("hidden"),t.classList.add("hidden")}function L(o){try{K.navigate(o)}catch(e){console.error("Navigation error:",e),location.hash="#/"}}window.addEventListener("hashchange",()=>L(location.hash));window.addEventListener("load",()=>{L(location.hash||"#/"),E()});document.getElementById("logoutBtn").addEventListener("click",()=>{m.logout(),location.hash="#/login",E()});"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(e=>{console.log("SW registered: ",e),"PushManager"in window?(console.log("PushManager is available"),navigator.serviceWorker.addEventListener("message",t=>{t.data&&t.data.type==="NEW_STORY"&&"Notification"in window&&Notification.permission==="granted"&&new Notification(t.data.title,{body:t.data.message,icon:"/icons/icon-192.png"})})):console.warn("PushManager is not available")}).catch(e=>{console.log("SW registration failed: ",e)});document.querySelector('a[href="#main"]')?.addEventListener("click",o=>{o.preventDefault();const e=document.querySelector("main");e&&(e.setAttribute("tabindex","-1"),e.focus())});

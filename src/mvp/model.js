const BASE_URL = 'https://story-api.dicoding.dev/v1';

// Ekspor kelas Auth dan lainnya dengan benar
export class Auth {
  static getToken(){ return localStorage.getItem('token'); }
  static setToken(t){ localStorage.setItem('token', t); }
  static logout(){ localStorage.removeItem('token'); }
}

export class PushNotification {
  static async subscribe() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging is not supported');
      return null;
    }

    try {
      // Periksa permission terlebih dahulu
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array('BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk')
      });
      
      // Kirim subscription ke server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
      return null;
    }
  }

  static async sendSubscriptionToServer(subscription) {
    try {
      // Pastikan subscription valid
      if (!subscription) {
        console.error('Subscription is null or undefined');
        throw new Error('Subscription object is invalid');
      }
      
      // Dapatkan keys dari subscription menggunakan metode getKey()
      const p256dh = this.arrayBufferToBase64(subscription.getKey('p256dh'));
      const auth = this.arrayBufferToBase64(subscription.getKey('auth'));
      
      // Ekstrak data yang diperlukan dari subscription
      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: p256dh,
          auth: auth
        }
      };

      console.log('Sending subscription to server:', subscriptionData);
      
      const response = await fetch(BASE_URL + '/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Auth.getToken()
        },
        body: JSON.stringify(subscriptionData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        throw new Error('Failed to send subscription to server: ' + response.status);
      }
      
      const responseData = await response.json();
      console.log('Subscription sent to server successfully:', responseData);
      
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      throw error;
    }
  }

  static urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  static arrayBufferToBase64(buffer) {
    if (!buffer) return '';
    
    const binary = [];
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    
    for (let i = 0; i < len; i++) {
      binary.push(String.fromCharCode(bytes[i]));
    }
    
    return window.btoa(binary.join(''));
  }
}

async function apiFetch(path, { auth=false, method='GET', headers={}, body } = {}){
  const finalHeaders = new Headers(headers);
  if (auth){
    const t = Auth.getToken();
    if (t) finalHeaders.set('Authorization', 'Bearer ' + t);
  }
  
  if (body && !(body instanceof FormData)) {
    finalHeaders.set('Content-Type', 'application/json');
  }
  
  const res = await fetch(BASE_URL + path, { 
    method, 
    headers: finalHeaders, 
    body: body instanceof FormData ? body : JSON.stringify(body) 
  });
  
  let data;
  try { 
    data = await res.json(); 
  } catch(e) { 
    data = {}; 
    console.error('Error parsing JSON response:', e);
  }
  
  if (!res.ok || data.error){
    const msg = data.message || res.statusText || 'Permintaan gagal';
    throw new Error(msg);
  }
  
  return data;
}

export class StoryModel {
  async register({ name, email, password }){
    return apiFetch('/register', {
      method:'POST',
      body: { name, email, password }
    });
  }
  
  async login({ email, password }){
    return apiFetch('/login', {
      method:'POST',
      body: { email, password }
    });
  }
  
  async list({ page=1, size=10, location=0 } = {}){
    const params = new URLSearchParams({ 
      page: page.toString(), 
      size: size.toString(), 
      location: location.toString() 
    });
    
    return apiFetch('/stories?' + params.toString(), { auth: true });
  }
  
  async detail(id){
    return apiFetch('/stories/' + id, { auth: true });
  }
  
  async add({ description, photoBlob, lat=null, lon=null }){
    const form = new FormData();
    form.append('description', description);
    form.append('photo', photoBlob, 'photo.jpg');
    
    if (lat != null) form.append('lat', lat.toString());
    if (lon != null) form.append('lon', lon.toString());
    
    return apiFetch('/stories', { 
      auth: true, 
      method: 'POST', 
      body: form 
    });
  }
}
import { Router } from './router.js';
import { Auth } from '../mvp/model.js';
import { PushNotification } from '../mvp/model.js';

const router = new Router(document.getElementById('main'));

async function syncAuthUI(){
  const token = Auth.getToken();
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (token){
    loginLink.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    
    // Subscribe to push notifications when user is logged in
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const subscription = await PushNotification.subscribe();
        if (subscription) {
          console.log('User is subscribed to push notifications');
        }
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
      }
    }
  } else {
    loginLink.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
}

// Error handling untuk navigation
function safeNavigate(hash) {
  try {
    router.navigate(hash);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback ke halaman home jika ada error
    location.hash = '#/';
  }
}

window.addEventListener('hashchange', () => safeNavigate(location.hash));
window.addEventListener('load', () => {
  safeNavigate(location.hash || '#/');
  syncAuthUI();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  Auth.logout();
  location.hash = '#/login';
  syncAuthUI();
});

// Service Worker Registration dengan path yang benar
if ('serviceWorker' in navigator){
  // Tentukan path service worker berdasarkan environment
  const swPath = process.env.NODE_ENV === 'production' ? '/dicoding-story/sw.js' : '/sw.js';
  
  navigator.serviceWorker.register(swPath)
    .then(registration => {
      console.log('SW registered: ', registration);
      
      // Periksa status push manager setelah service worker terdaftar
      if ('PushManager' in window) {
        console.log('PushManager is available');
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
          if (event.data && event.data.type === 'NEW_STORY') {
            // Show local notification when new story is added
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(event.data.title, {
                body: event.data.message,
                icon: '/icons/icon-192.png'
              });
            }
          }
        });
      } else {
        console.warn('PushManager is not available');
      }
    })
    .catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
}

export { router, syncAuthUI };

document.querySelector('a[href="#main"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  const mainEl = document.querySelector('main');
  if (mainEl) {
    mainEl.setAttribute('tabindex', '-1');
    mainEl.focus();
  }
});
const DB_NAME = 'dicoding-story-db';
const DB_VERSION = 2; // Upgrade version untuk menambahkan store baru
const OBJECT_STORE_NAMES = {
  STORIES: 'stories',
  SAVED_STORIES: 'savedStories'
};

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('Error saat membuka IndexedDB: ' + event.target.errorCode);
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Buat object store untuk stories biasa
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAMES.STORIES)) {
        db.createObjectStore(OBJECT_STORE_NAMES.STORIES, { keyPath: 'id' });
      }
      
      // Buat object store untuk saved stories
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAMES.SAVED_STORIES)) {
        db.createObjectStore(OBJECT_STORE_NAMES.SAVED_STORIES, { keyPath: 'id' });
      }
    };
  });
}

export const db = {
  async get(storeName, key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async getAll(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async put(storeName, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async delete(storeName, key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  async clear(storeName) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};
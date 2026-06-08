
// import 'fake-indexeddb/auto';
import { EventRepository } from "./EventRepository";

export class IndexedDBEventRepository extends EventRepository {
  constructor(dbName = "CampusEventsDB") {
    super();
    this.dbName = dbName;
    this.storeName = "events";
  }

  async _withStore(mode, callback) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: "id" });
        }
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction(this.storeName, mode);
        const store = tx.objectStore(this.storeName);
        callback(store, resolve, reject);
        tx.oncomplete = () => db.close();
      };

      request.onerror = (e) => reject(e.target.error);
    });
  }

  async add(event) {
    return this._withStore("readwrite", (store, resolve, reject) => {
      const req = store.add(event);
      req.onsuccess = () => resolve(event);
      req.onerror = (e) => reject(e.target.error);
    });
    
  }

  async getById(id) {
    return this._withStore("readonly", (store, resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async getAll() {
    return this._withStore("readonly", (store, resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async update(event) {
    return this._withStore("readwrite", (store, resolve, reject) => {
      const req = store.put(event);
      req.onsuccess = () => resolve(event);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  async remove(id) {
    return this._withStore("readwrite", (store, resolve, reject) => {
      const req = store.delete(id);
      req.onsuccess = () => resolve(id);
      req.onerror = (e) => reject(e.target.error);
    });
  }
}
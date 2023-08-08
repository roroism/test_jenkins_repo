import { resolve } from 'dns';

var db;

const openDb = async () => {
  return new Promise((resolve) => {
    var openRequest = window.indexedDB.open('cublick', 1);
    openRequest.onupgradeneeded = (e: any) => {
      db = e.target.result;
      const objectStore = db.createObjectStore('Images', { keyPath: 'url' });
      objectStore.createIndex('image', 'image', { unique: 'false' });
      resolve(true);
    };

    openRequest.onsuccess = (e: any) => {
      console.log('here');
      console.log(e);
      db = e.target.result;
      resolve(true);
    };
  });
};

const saveImage = ({ url, image }) => {
  return new Promise((resolve) => {
    const imagesObjectStore = db.transaction('Images', 'readwrite').objectStore('Images');
    const request = imagesObjectStore.add({ url, image });
    request.onsucess = (e) => {
      console.log(e);
    };
  });
};

const readImage = (url): any => {
  return new Promise((resolve) => {
    const imagesObjectStore = db.transaction('Images', 'readonly').objectStore('Images');
    const request = imagesObjectStore.get(url);
    request.onsuccess((e: any) => {
      if (e.target?.result) {
        return URL.createObjectURL(e.target.result.image);
      } else {
        return 'fail';
      }
    });
  });
};

const deleteImage = (url) => {
  const imagesObjectStore = db.transaction('Images', 'readwrite').objectStore('Images');
  const request = imagesObjectStore.delete(url);
};

const downloadImage = (url, callback) => {
  return new Promise((resolve) => {
    var xhr = new XMLHttpRequest(),
      blob;

    xhr.open('GET', url, true);
    // Set the responseType to blob
    xhr.responseType = 'blob';

    xhr.addEventListener(
      'load',
      function () {
        if (xhr.status === 200) {
          console.log('Image retrieved');

          // File as response
          blob = xhr.response;

          // Put the received blob into IndexedDB
          saveImage({ url: url, image: blob });
          console.log(blob);
          return callback(url);
        } else {
          return url;
        }
      },
      false
    );
    // Send XHR
    xhr.send();
  });
};

const handleImages = (url: string): string => {
  return readImage(url);
};

export { db, handleImages, saveImage, readImage, deleteImage };

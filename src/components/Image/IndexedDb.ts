//let request: IDBOpenDBRequest;
//let db: IDBDatabase;
let version = 1;

export interface image {
  url: string;
  image: any;
}

export enum Stores {
  Images = 'images',
}

export interface tableInit {
  keypath: string;
  columns: columnInit[];
}

export interface columnInit {
  name: string;
  path: string;
  options?: { unique: boolean };
}

//specify a db name, table name, keypath(primary key) and columns to create a db.
//run this every time you load a page or component that needs cached data to ensure that a db exists.
//if you want to make a new table either up the version or delete the already existing db in the application tab.
export const initDB = (dbName, tableName, data: tableInit, version = 1): Promise<boolean> => {
  return new Promise((resolve) => {
    // open the connection
    var request = indexedDB.open(dbName, version);

    request.onupgradeneeded = () => {
      var db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(tableName)) {
        console.log('Creating image store');
        const store = db.createObjectStore(tableName, { keyPath: data.keypath });
        data.columns.map((i) => {
          store.createIndex(i.path, i.name, i.options);
        });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      var db = request.result;
      version = db.version;
      resolve(true);
    };

    request.onerror = () => {
      resolve(false);
    };
  });
};

export const addData = <T>(
  dbName,
  tableName,
  url,
  version = 1
): Promise<T | { url; image } | string | null> => {
  return new Promise(async (resolve) => {
    var request = indexedDB.open(dbName, version);

    request.onsuccess = async () => {
      console.log('request.onsuccess - addData');
      var db = request.result;

      const res: Response = await downloadData(url);
      if (res.status === 200) {
        console.log(res);
        const imageBlob = await res.blob();
        const tx = db.transaction(tableName, 'readwrite');
        const store = tx.objectStore(tableName);
        store.add({ url: url, image: imageBlob });
        resolve({ url: url, image: imageBlob });
      }
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

export const getData = <T>(dbName, tableName, url, version = 1): Promise<T | string> => {
  console.log(dbName, tableName, url);
  return new Promise((resolve) => {
    var request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      var db = request.result;
      const tx = db.transaction(tableName, 'readonly');
      const store = tx.objectStore(tableName);
      const res = store.get(url);
      res.onsuccess = () => {
        if (res.result) {
          const temp = res.result;
          resolve(temp);
        } else {
          //addData(dbName, tableName, url);
          resolve('fail');
        }
      };
    };

    request.onerror = () => {
      resolve('fail');
    };
  });
};

export const saveData = <T>(dbName, tableName, data, version = 1): Promise<T | string> => {
  return new Promise((resolve) => {
    var request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      var db = request.result;
      const tx = db.transaction(tableName, 'readwrite');
      const store = tx.objectStore(tableName);
      console.log(data);
      const res = store.add(data);
      res.onsuccess = (e) => {
        resolve('success');
      };
      res.onerror = (e) => {
        resolve('error');
      };
    };

    request.onerror = () => {
      resolve('fail');
    };
  });
};

export const downloadData = <T>(url): Promise<T | Response> => {
  return new Promise(async (resolve) => {
    const res = await fetch(url);
    resolve(res);
  });
};

export const downloadMedia = <T>(url): Promise<T | Blob> => {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(url);
    if (res.status === 200) {
      const imageBlob = await res.blob();
      resolve(imageBlob);
    }
    reject(res);
  });
};

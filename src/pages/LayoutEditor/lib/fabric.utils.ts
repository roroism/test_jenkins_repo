import { fabric } from 'fabric';

export const promised_fabric_loadSVGFromString = (url: string) => {
  return new Promise<{ objects: fabric.Object[]; options: any }>((resolve, reject) => {
    fabric.loadSVGFromString(url, (objects, options) => {
      if (!!objects) resolve({ objects, options });
      reject(null);
    });
  });
};

const fromUrlCache = new Map<string, { objects: fabric.Object[]; options: any }>();
export const promised_fabric_loadSVGFromURL = (url: string) => {
  return new Promise<{ objects: fabric.Object[]; options: any }>((resolve, reject) => {
    if (fromUrlCache.has(url)) {
      resolve(fromUrlCache.get(url));
      return;
    }
    fabric.loadSVGFromURL(url, (objects, options) => {
      if (!!objects) {
        fromUrlCache.set(url, { objects, options });
        resolve({ objects, options });
      }
      reject(null);
    });
  });
};

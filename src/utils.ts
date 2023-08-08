import md5 from 'md5';
import { ContentAPISingle, CreateContentParam } from './apis/content';

/**
 * Format number bytes with unit.
 * @param bytes     Row bytes number.
 * @param decimals  Decimal
 */

export function formatBytes(bytes: number, decimals?: number): string {
  // If input byte lower then 0...
  if (!bytes) {
    return '0 Bytes';
  }

  const kilo = 1000,
    dm = decimals <= 0 ? 0 : decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    unitIndex = Math.floor(Math.log(bytes) / Math.log(kilo));

  return parseFloat((bytes / Math.pow(kilo, unitIndex)).toFixed(dm)) + ' ' + sizes[unitIndex];
}

/**
 * Is auth token valid or not expired?
 * @param token Token.
 * @returns     Is token valid?
 */
export function isTokenValid(token: string): boolean {
  try {
    // Is token exist?
    if (!token) {
      return false;
    }

    // Split token.
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    // Decode token payload part.
    let output = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string');
    }
    const decoded = JSON.parse(decodeURIComponent(window.atob(output)));

    // Check is expired.
    if (!decoded.hasOwnProperty('exp')) {
      throw new Error('No expired time');
    }
    const date = new Date(0).setUTCSeconds(decoded.exp);
    return date !== null ? date.valueOf() > new Date().valueOf() : true;
  } catch (err) {
    return false;
  }
}

/**
 * file을 읽어서 md5값을 반환한다.
 * @author 오지민 2023.02.04
 * @param file 읽을 파일
 * @returns 파일의 md5값
 */
export function md5File(file: File) {
  return new Promise<string>((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onloadend = (e) => resolve(md5(e.target.result.toString()));
      reader.readAsBinaryString(file);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 일반 함수를 debounce 함수로 변환해준다.
 * @author  오지민 2023.02.04
 * @param executor 전환할 일반함수
 * @param delay debounce 시간
 * @returns debounce 함수
 */
export function debounce<F extends (...args: any) => any>(executor: F, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      executor(...args);
    }, delay);
  };
}

/**
 * 일반 함수를 throttle 함수로 변환해준다.
 * @author  오지민 2023.02.17
 * @param executor 전환할 일반함수
 * @param delay throttle 시간
 * @returns throttle 함수
 */
export function throttle<F extends (...args: any) => any>(executor: F, limit: number) {
  let waiting = false;
  return (...args: Parameters<F>) => {
    if (waiting) return;
    executor(...args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}

/**
 * rgba로 된 생상정보를 hexa color로 변환
 * @author 오지민 2023.02.04
 * @param rgba rgba값, 각 색상의 범위는 0~255, alpha값은 0~1
 * @returns hexa값 #rrggbbaa
 */
export const rgbaToHexa = (rgba: { r: number; g: number; b: number; a: number }) => {
  const r = ('0' + rgba.r.toString(16)).slice(-2);
  const g = ('0' + rgba.g.toString(16)).slice(-2);
  const b = ('0' + rgba.b.toString(16)).slice(-2);
  const a = ('0' + parseInt((rgba.a * 255).toString()).toString(16)).slice(-2);
  return '#' + r + g + b + a;
};

/**
 * hexa color를 rgba로 변환
 * @author 오지민 2023.02.04
 * @param hexa hexa값 #rrggbbaa
 * @returns rgba값, 각 색상의 범위는 0~255, a값은 0~1
 */
export const hexaToRgba = (hexa: string) => {
  const r = parseInt(hexa.substring(1, 3), 16);
  const g = parseInt(hexa.substring(3, 5), 16);
  const b = parseInt(hexa.substring(5, 7), 16);
  const a = parseInt(hexa.substring(7, 9), 16) / 255;
  return { r, g, b, a };
};

/**
 * rgba 객체를 string으로 변환해주는 함수
 * @author 오지민 2023.02.04
 * @param rgba rgba값, 각 색상의 범위는 0~255, alpha값은 0~1
 * @returns
 */
export const rgbaToString = (rgba: { r: number; g: number; b: number; a: number }) => {
  const r = rgba.r.toString();
  const g = rgba.g.toString();
  const b = rgba.b.toString();
  const a = rgba.a.toString();
  return `rgba(${r},${g},${b},${a})`;
};

/**
 * 깊은 객체복사를 수행한다.
 * @author 오지민 2023.02.04
 * @param data 복사될 객체
 * @returns 복사된 객체
 */
export const cloneDeep = <T extends Object>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

/**
 * 숫자가 min과 max 사이에 있는지 검사한다.
 * @author 오지민 2023.02.04
 * @param target 검사할 숫자
 * @param min
 * @param max
 * @returns
 */
export const isNumberBetween = (target: number, min: number, max: number) => {
  return target >= min && target <= max;
};

/**
 * ContentAPISingle을 CreateContentParam으로 변환한다.
 *
 * @author 오지민 2023.02.04
 * @param contentAPISingle 변경할 ContentAPISingle
 * @returns 변경된 CreateContentParam
 */
export const contentAPISingleToCreateContentParam = (
  contentAPISingle: ContentAPISingle
): CreateContentParam => {
  return {
    backgroundColor: contentAPISingle.backgroundColor,
    category: contentAPISingle.category,
    categoryId: contentAPISingle.categoryId,
    data: contentAPISingle.data,
    deptName: contentAPISingle.deptName,
    didInfo: contentAPISingle.didInfo,
    endDate: contentAPISingle.endDate,
    imageAlign: contentAPISingle.imageAlign as CreateContentParam['imageAlign'],
    images: contentAPISingle.images,
    name: contentAPISingle.name,
    playingDevices: contentAPISingle.playingDevices,
    startDate: contentAPISingle.startDate,
    textAlign: contentAPISingle.textAlign as CreateContentParam['textAlign'],
    textColor: contentAPISingle.textColor,
    textForm: contentAPISingle.textForm,
    titleBorder: contentAPISingle.titleBorder,
    titleColor: contentAPISingle.titleColor,
  };
};

/**
 * length넘겨준 값의 길이만큼 16진수 난수를 생성
 * @author Oh_jimin
 * @param length 만들어내는 16진수 난수의 길이
 * @return 16진수 난수, 앞에 0x가 붙어있지 않음
 */
export const createHexID = (length: number) => {
  const candidate = '0123456789abcdef';
  return new Array(length)
    .fill(1)
    .map((_) => candidate[Math.floor(Math.random() * 16)])
    .join('');
};

/**
 * 로드된 이미지 엘리멘트를 캐싱하기 위한 Map
 *
 * @author 오지민 2023.03.01
 * @private
 * @key 이미지의 src
 * @value 이미지 엘리멘트
 * @deprecated ImageLoader클래스를 사용해주세요.
 */
export const imageElmentCache = new Map<string, HTMLImageElement>();
/**
 * Image Elemnt를 생성
 *
 * 1. 로드가 끝난 Image Element를 반환 ( resolve )
 * 2. 로드가 실패한 경우 reject
 * 3. 이미 로드된 이미지는 캐싱된 이미지 엘리멘트를 반환
 *
 * @author 오지민 2023.03.01
 * @param src image element의 source경로
 * @return 만들어진 image element를 반환하는 promise
 * @usecase 에디터에서 이미지를 캔버스로 로드할 때 사용
 * @deprecated ImageLoader클래스를 사용해주세요.
 */
export const createImageElement = (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    try {
      if (imageElmentCache.has(src)) {
        resolve(imageElmentCache.get(src));
        return;
      }
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        ImageLoader.setCache(src, image);
        resolve(image);
      };
      image.onerror = (error) => reject(error);
      image.src = src;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * createImageElement와 imageElmentCache의 클래스버전
 *
 * @author 오지민 2023.03.01
 */
export class ImageLoader {
  /**
   * 로드된 이미지 엘리멘트를 캐싱하기 위한 Map
   *
   * @author 오지민 2023.03.01
   * @private
   * @key 이미지의 src
   * @value 이미지 엘리멘트
   */
  static cache: Map<string, HTMLImageElement> = new Map();

  /**
   * 이미지 엘리멘트를 캐싱한다. src가 이미 캐싱되어 있다면 캐싱하지 않는다.
   *
   * @author 오지민 2023.03.01
   * @param src 캐싱할 이미지의 src
   * @param image 캐싱할 이미지 엘리멘트
   */
  static setCache(src: string, image: HTMLImageElement) {
    if (this.cache.has(src)) return;
    ImageLoader.cache.set(src, image);
  }

  /**
   * 이미지 엘리멘트를 캐시에서 삭제한다. 캐싱되어 있지 않은 src를 삭제하려고 하면 아무일도 일어나지 않는다.
   *
   * @author 오지민 2023.03.01
   * @param srces 캐시를 삭제할 이미지의 src들
   */
  static invalidateCaches(srces: string[]) {
    srces.forEach((src) => this.cache.delete(src));
  }

  /**
   * 모든 이미지 엘리멘트를 캐시에서 삭제한다.
   *
   * @author 오지민 2023.03.01
   */
  static invalidateAllCaches() {
    this.cache.clear();
  }

  /**
   * Image Elemnt를 생성
   *
   * 1. 로드가 끝난 Image Element를 반환 ( resolve )
   * 2. 로드가 실패한 경우 reject
   * 3. 이미 로드된 이미지는 캐싱된 이미지 엘리멘트를 반환
   *
   * @author 오지민 2023.03.01
   * @param src image element의 source경로
   * @return 만들어진 image element를 반환하는 promise
   * @usecase 에디터에서 이미지를 캔버스로 로드할 때 사용
   */
  static load(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      try {
        if (ImageLoader.cache.has(src)) {
          resolve(ImageLoader.cache.get(src));
          return;
        }
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          ImageLoader.cache.set(src, image);
          resolve(image);
        };
        image.onerror = (error) => reject(error);
        image.src = src;
      } catch (error) {
        reject(error);
      }
    });
  }
}

/**
 * 키보드 이벤트를 받아서 해당 이벤트가 컨트롤이나 커맨드(맥)를 누른 이벤트인지 아닌지를 판단
 *
 * @author 오지민 2023.02.17
 * @param e 검사할 키보드 이벤트
 * @returns 컨트롤키나 커맨드키가 눌린 이벤트인가 아닌가
 */
export const isCtrlOrCmd = (e: KeyboardEvent) => {
  return e.ctrlKey || e.metaKey;
};

/**
 * 윈도우에 객체에 이벤트를 등록할 때, 이벤트를 등록한 객체를 기억해두고
 * 이벤트를 전부삭제할 수 있도록 하는 클래스
 *
 * @author 오지민 2023.02.12
 * @deprecated
 */
export class WindowEvent {
  static eventMap: Map<
    keyof WindowEventMap,
    Set<(this: Window, ev: WindowEventMap[keyof WindowEventMap]) => any>
  > = new Map();

  /**
   * window.removeEventListener와 사용밥법이 동일하다.
   *
   * @author 오지민 2023.02.12
   */
  static removeEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ) {
    window.removeEventListener(type, listener, options);
    this.eventMap.get(type).delete(listener);
  }

  /**
   * window.addEventListener와 사용밥법이 동일하다.
   *
   * @author 오지민 2023.02.12
   */
  static addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    if (!Object.keys(this.eventMap).includes(type)) {
      this.eventMap.set(type, new Set());
    }
    this.eventMap.get(type).add(listener);
    window.addEventListener(type, listener, options);
  }

  /**
   * 등록된 모든 이벤트 핸들러를 등록해제한다.
   *
   * @warning
   * 1. 이벤트를 등록할 때, 이 클래스의 addEventListener를 사용해야 한다.
   * 2. 이벤트를 삭제할 때, 이 클래스의 removeEventListener를 사용해야 한다.
   *
   * @author 오지민 2023.02.12
   */
  static removeAllEventListeners() {
    this.eventMap.forEach((set, key) => {
      set.forEach((listener) => {
        window.removeEventListener(key, listener);
      });
    });
  }
}

/**
 * rgba 색상을 argb 색상으로 변환
 *
 * @author 오지민 2023.02.12
 * @param rgba #RRGGBBAA 형식의 rgba 색상
 * @returns #AARRGGBB 형식의 argb 색상
 * @usecase 캔버스에서는 rgba를 사용하고 큐브릭렌더러에서는 argb를 사용하므로 중간에 변환을 위해 사용
 */
export function RGBAtoARGB(rgba: string) {
  const rgb = rgba.substring(1, 7);
  const a = ('0' + rgba.slice(7)).slice(-2);
  const res = '#' + a + rgb;
  return res;
}

/**
 * argb 색상을 rgba 색상으로 변환
 *
 * @author 오지민 2023.02.12
 * @param rgba #AARRGGBB 형식의 argb 색상
 * @returns #RRGGBBAA 형식의 rgba 색상
 * @usecase 캔버스에서는 rgba를 사용하고 큐브릭렌더러에서는 argb를 사용하므로 중간에 변환을 위해 사용
 */
export function ARGBtoRGBA(argb: string) {
  const a = argb.substring(0, 2);
  const rgb = argb.substring(2);
  return rgb + a;
}

/**
 * 배열에서 요소의 타입을 추론하는 유틸리티 타입
 *
 * @example
 * const arr = [1, 2, 3];
 * type A = ArrayElement<typeof arr>; // A는 number
 *
 * const arr2 = ['1', '2', '3'];
 * type B = ArrayElement<typeof arr2>; // B는 string
 *
 * const arr3 = [1, '2', 3];
 * type C = ArrayElement<typeof arr3>; // C는 number | string
 *
 * @author 오지민 2023.02.12
 * @param ArrayType 배열의 타입
 * @returns 배열의 요소의 타입
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * 프로토타입까지 복사해주는 깊은 복사 함수
 *
 * @author 오지민 2023.02.12
 * @param instance 복사할 객체
 * @returns 복사된 객체
 * @warning 최신js의 몇몇 문법에서는 동작하지 않음. (ex. getter, setter)
 */
export function clone(instance: any) {
  return Object.assign(
    Object.create(
      // Set the prototype of the new object to the prototype of the instance.
      // Used to allow new object behave like class instance.
      Object.getPrototypeOf(instance)
    ),
    // Prevent shallow copies of nested structures like arrays, etc
    JSON.parse(JSON.stringify(instance))
  );
}

export function copyToClipboard(target: any) {
  if (typeof target === 'string') {
    navigator.clipboard.writeText(target);
  } else {
    navigator.clipboard.writeText(JSON.stringify(target));
  }
  alert('copied');
}

export function modulo(n, d) {
  return ((n % d) + d) % d;
}

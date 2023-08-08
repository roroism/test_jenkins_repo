import { config } from '@app/src/config';
import { store } from '@app/src/store';
import { RawPresentation, RawPresentationRegion } from '@cublick/parser/models';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import {
  PresentationAPIResponse,
  PresentationDesignData,
  PresentationForUpload,
} from './presentationApi.model';

export const getPresentations = async (params: APIListParams) => {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}`;
  const axiosConfig = createAuthConfig({ params });
  const res = await axios.get<APIList<PresentationAPIResponse>>(url, axiosConfig);
  return res.data;
};

export async function getPresentation(presentationId: string) {
  const uri = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}`;
  const axiosConfig = createAuthConfig();
  const response = await axios.get<PresentationDesignData>(uri, axiosConfig);
  return response.data;
}

export async function deletePresentation(presentationId: string) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.delete(url, axiosConfig);
  return res;
}

export async function putPresentation<K extends keyof PresentationAPIResponse>(
  presentationId: string,
  params: { [key in K]: PresentationAPIResponse[K] }
) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.put(url, params, axiosConfig);
  return res.data;
}

export async function postPresentationForEditor(rawPresentation: RawPresentation, thumbnail: File) {
  const presentationForUpload = {
    code: rawPresentation.code,
    name: rawPresentation.name,
    desc: rawPresentation.desc,
    tags: rawPresentation.tags,
    lock: rawPresentation.lock,
    orientation: rawPresentation.orientation,
    ratio: rawPresentation.ratio,
    width: rawPresentation.width,
    height: rawPresentation.height,
    bgAudioEnable: rawPresentation.bgAudioEnable,
    bgEnable: rawPresentation.bgEnable,
    categories: rawPresentation.categories,
    bg: rawPresentation.bg,
    bgAudio: rawPresentation.bgAudio,
    sharedList: [],
    mobility: false,
  };

  const { id: presentationId } = await postPresentationInfo(presentationForUpload);
  await postPresentationDesign(presentationId, rawPresentation.regions);
  await putPresentationAssetList(presentationId, rawPresentation.assetList);
  await postPresentationThumbnail(presentationId, thumbnail);
  return presentationId;
}

export async function putPresentationForEditor(rawPresentation: RawPresentation, thumbnail: File) {
  const presentationForUpload = {
    code: rawPresentation.code,
    name: rawPresentation.name,
    desc: rawPresentation.desc,
    tags: rawPresentation.tags,
    lock: rawPresentation.lock,
    orientation: rawPresentation.orientation,
    ratio: rawPresentation.ratio,
    width: rawPresentation.width,
    height: rawPresentation.height,
    bgAudioEnable: rawPresentation.bgAudioEnable,
    bgEnable: rawPresentation.bgEnable,
    categories: rawPresentation.categories,
    bg: rawPresentation.bg,
    bgAudio: rawPresentation.bgAudio,
    sharedList: [],
    mobility: false,
  };

  const { id: presentationId } = await postPresentationInfo(presentationForUpload);
  await postPresentationDesign(presentationId, rawPresentation.regions);
  await putPresentationAssetList(presentationId, rawPresentation.assetList);
  await postPresentationThumbnail(presentationId, thumbnail);
  return presentationId;
}

// post/put presentation helper functions ------------------------------------------------------------------
export async function postPresentationInfo(presntationInfo: PresentationForUpload) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}`;
  const body = presntationInfo;
  const axiosConfig = createAuthConfig();
  const res = await axios.post(url, body, axiosConfig);
  return res.data;
}

export async function putPresentationInfo(presntationInfo: PresentationForUpload) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}`;
  const body = presntationInfo;
  const axiosConfig = createAuthConfig();
  const res = await axios.put(url, body, axiosConfig);
  return res.data;
}

export async function postPresentationDesign(
  presentaitonId: string,
  regions: RawPresentationRegion[]
) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentaitonId}/design`;
  const body = { designData: JSON.stringify(regions) };
  const axiosConfig = createAuthConfig();
  const res = await axios.post(url, body, axiosConfig);
  return res.data;
}

export async function getPresentationDesign(presentaitonId: string) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentaitonId}/design`;
  const axiosConfig = createAuthConfig();
  const res = await axios.post(url, axiosConfig);
  return res.data;
}

export async function putPresentationAssetList(
  presentationId: string,
  assetList: RawPresentation['assetList']
) {
  const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}/assets`;
  const body = { assets: JSON.stringify(assetList) };
  const axiosConfig = createAuthConfig();
  const res = await axios.put(url, body, axiosConfig);
  return res.data;
}

export async function postPresentationThumbnail(presentationId: string, thumbnail: File) {
  const uri = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}/${presentationId}/thumbnail`;
  const body = new FormData();
  body.append('file', thumbnail);
  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

// 서버 로직 완성 후 재작업
export function uploadPresentationStyle(prstId, style) {
  const styleBody = {
    styleNameList: JSON.stringify([style]),
    targetType: 'PRESENTATION',
    targetId: prstId,
  };

  // return axios.post(`https://api-service.cublick.com/v1/auth/setStyle`, styleBody, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });
  return axios.post(`http://192.168.0.32:8080/v1/auth/setStyle`, styleBody, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
}

export function uploadPresentationMood(prstId, mood) {
  const moodBody = {
    moodNameList: JSON.stringify([mood]),
    targetType: 'PRESENTATION',
    targetId: prstId,
  };
  // return axios.post(`https://api-service.cublick.com/v1/auth/setMood`, moodBody, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });
  return axios.post(`http://192.168.0.32:8080/v1/auth/setMood`, moodBody, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
}

export function uploadPresentationTag(presentationId, tag) {
  let tagNames = [];

  if (Array.isArray(tag)) {
    tagNames = tag.map((tags) => tags.tagName);
  } else {
    tagNames = [tag.tagName];
  }

  return axios.post(
    `https://api-service.cublick.com/v1/auth/presentations/${presentationId}/tagging`,
    { tags: JSON.stringify(tagNames) },
    { headers: { 'X-Access-Token': store.getState().appAuth.token } }
  );
  // const tags = tag.map((x) => x.tagName);
  // return axios.post(
  //   `https://api-service.cublick.com/v1/auth/presentations/${presentationId}/tagging`,
  //   //   `http://192.168.0.32:8080/v1/auth/presentations/${presentationId}/tagging`,
  //   { tags: JSON.stringify(tags) },
  //   { headers: { 'X-Access-Token': store.getState().appAuth.token } }
  // );
}
export function uploadPresentationPrice(prstId, price) {
  const priceBody = {
    price: price,
  };
  // return axios.post(
  //   `https://api-service.cublick.com/v1/auth/presentations/` + prstId + `/setPrice`,
  //   priceBody,
  //   { headers: { 'X-Access-Token': store.getState().appAuth.token } }
  // );
  return axios.post(
    `http://192.168.0.32:8080/v1/auth/presentations/` + prstId + `/setPrice`,
    priceBody,
    {
      headers: { 'X-Access-Token': store.getState().appAuth.token },
    }
  );
}
export function uploadMood(presentationId, mood) {
  const moodBody = {
    moodNameList: JSON.stringify([mood]),
    targetType: 'PRESENTAION',
    targetId: presentationId,
  };
  // axios.post(`https://api-service.cublick.com/v1/auth/setMood`, moodBody, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });
  axios.post(`http://192.168.0.32:8080/v1/auth/setMood`, moodBody, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
}

export function uploadStyle(presentaitonId, style) {
  const styleBody = {
    styleNameList: JSON.stringify([style]),
    targetType: 'PRESENTAION',
    targetId: presentaitonId,
  };

  // axios.post(`https://api-service.cublick.com/v1/auth/setStyle`, styleBody, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });
  axios.post(`http://192.168.0.32:8080/v1/auth/setStyle`, styleBody, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
}

export const multiSearchApiPresentationFetcher = async (
  bigCategory,
  page,
  middleCategory,
  minPrice,
  maxPrice,
  newPerPage,
  perPage
) => {
  const res = await axios.post(`http://192.168.0.28:3000/category_search`, {
    main: bigCategory,
    page: page,
    middle: middleCategory,
    price: [minPrice, maxPrice],
    moods: '',
    likes: [],
    styles: '',
    sort: '',
    perPage: newPerPage || perPage,
  });
  return res;
};

// shop
export const apiPresentationFetcher = async (options: APIListParams) => {
  const newHeader = createAuthConfig({
    baseURL: config.EXTERNAL.CUBLICK.PRESENTATION.PRE,
  });

  const PresentationApiRoot = axios.create(newHeader);
  return PresentationApiRoot.get<APIList<PresentationAPIResponse>>(
    `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}`,
    {
      params: {
        order: options.order,
        page: options.page,
        perPage: options.perPage,
        sort: options.sort,
        filter: JSON.stringify(options.filter),
        q: options?.q,
      },
    }
  );
};

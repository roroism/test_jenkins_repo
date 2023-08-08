import { config } from '@app/src/config';
import { store } from '@app/src/store';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { Asset, AssetUploadPolicy } from './assetApi.model';

export async function getAsset(assetId: string) {
  const uri = config.EXTERNAL.CUBLICK.ASSET.AST + '/' + assetId;
  const axiosConfig = createAuthConfig();
  const res = await axios.get(uri, axiosConfig);
  return res.data;
}

export async function putAsset<K extends keyof Asset>(
  assetId: string,
  params: { [key in K]: Asset[K] }
) {
  const uri = config.EXTERNAL.CUBLICK.ASSET.AST + '/' + assetId;
  const axiosConfig = createAuthConfig();
  const res = await axios.put(uri, params, axiosConfig);
  return res.data;
}

export async function deleteAsset(assetId: string) {
  const uri = config.EXTERNAL.CUBLICK.ASSET.AST + '/' + assetId;
  const axiosConfig = createAuthConfig();
  const res = await axios.delete(uri, axiosConfig);
  return res;
}

// upload asset to cdn ----------------------------------------------------------------------
export async function getAssetUploadPolicy(filename: string) {
  const url = config.EXTERNAL.CUBLICK.ASSET.UPL;
  const axiosConfig = createAuthConfig({ params: { filename } });
  const res = await axios.get<AssetUploadPolicy>(url, axiosConfig);
  return res.data;
}

export async function uploadAssetToCDN(policy: AssetUploadPolicy, file: File) {
  const body = new FormData();
  body.append('key', policy.key);
  body.append('bucket', policy.bucket);
  body.append('GoogleAccessId', policy.googleAccessId);
  body.append('success_action_status', policy.successActionStatus);
  body.append('success_action_redirect', policy.successActionRedirect);
  body.append('policy', policy.policy);
  body.append('signature', policy.signature);
  body.append('file', file);

  const url = config.EXTERNAL.CUBLICK.CDN;
  const axiosConfig = createAuthConfig();
  const res = await axios.post(url, body, axiosConfig);
  return res.data;
}

export async function uploadAssetToLocalServer(file: File) {
  const uri = `${config.EXTERNAL.CUBLICK.ASSET.AST}`;
  const formData = new FormData();
  formData.append('file', file, file.name);
  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, formData, axiosConfig);
  return res.data;
}

export async function mediaAnalyzingProxyAddressGetter() {
  const uri = config.EXTERNAL.CUBLICK.PRESENTATION.STOREPREASSET;
  const ngrokRes = await axios.get(uri, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
  console.log('resresres', ngrokRes);
  return ngrokRes.data;
}

//---------------asset style upload---------------------------------
export function uploadAssetStyle(assetId, style) {
  const styleBody = {
    styleNameList: JSON.stringify([style]),
    targetType: 'ASSET',
    targetId: assetId,
  };
  // return axios.post(`https://api-service.cublick.com/v1/auth/setStyle`, styleBody, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });
  return axios.post(`http://192.168.0.32:8080/v1/auth/setStyle`, styleBody, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
}

export function uploadAssetMood(assetId, mood) {
  const moodBody = {
    moodNameList: JSON.stringify([mood]),
    targetType: 'ASSET',
    targetId: assetId,
  };
  // return axios.post(`https://api-service.cublick.com/v1/auth/setMood`, moodBody, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });
  return axios.post(`http://192.168.0.32:8080/v1/auth/setMood`, moodBody, {
    headers: { 'X-Access-Token': store.getState().appAuth.token },
  });
}

export function uploadAssetTag(assetId, tag) {
  const tags = [tag.map((x) => x.tagName)];
  return axios.post(
    //`https://api-service.cublick.com/v1/auth/assets/${assetId}/tagging`,
    `http://192.168.0.32:8080/v1/auth/presentations/${assetId}/tagging`,
    { tags: JSON.stringify(tags) },
    { headers: { 'X-Access-Token': store.getState().appAuth.token } }
  );
}

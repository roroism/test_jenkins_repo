import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig, getAuthHeader } from '../helper';
import { ContentAPISingle, CreateContentParam } from './contentApi.model';

export async function getContent(contentId: string) {
  const uri = `${config.EXTERNAL.CUBLICK.CONTENT.SELF}/${contentId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.get<ContentAPISingle>(uri, axiosConfig);
  return res.data;
}

export async function postContent(body: CreateContentParam) {
  const uri = config.EXTERNAL.CUBLICK.CONTENT.SELF;
  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export async function putContent(value: CreateContentParam, contentId: string) {
  const uri = `${config.EXTERNAL.CUBLICK.CONTENT.SELF}/${contentId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.put(uri, value, axiosConfig);
  return res.data;
}

export async function deleteContent(contentIds: any) {
  const url = config.EXTERNAL.CUBLICK.CONTENT.SELF + '/deletes';
  const axiosConfig = createAuthConfig();
  const body = { ids: contentIds };
  const res = await axios.put(url, body, axiosConfig);
  return res.data;
}

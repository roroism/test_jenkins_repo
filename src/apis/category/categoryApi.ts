import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { Category, CategoryAPIResponse } from './categoryApi.model';

export async function getCategory(categoryId: string) {
  const url = `${config.EXTERNAL.CUBLICK.CATEGORYMANAGEMENT.SELF}/${categoryId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.get<CategoryAPIResponse>(url, axiosConfig);
  return res.data;
}

export async function addCategory(body: Category) {
  const uri = config.EXTERNAL.CUBLICK.CATEGORYMANAGEMENT.SELF;
  const axiosConfig = createAuthConfig();
  delete body.id;
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export async function editCategory(body: Category) {
  const uri = `${config.EXTERNAL.CUBLICK.CATEGORYMANAGEMENT.SELF}/${body.id}`;
  const axiosConfig = createAuthConfig();
  delete body.id;
  const res = await axios.put(uri, body, axiosConfig);
  return res.data;
}

export async function deleteCategory(categoryId: string) {
  const uri = config.EXTERNAL.CUBLICK.CATEGORYMANAGEMENT.SELF + '/' + categoryId;
  const axiosConfig = createAuthConfig();
  const res = await axios.delete(uri, axiosConfig);
  return res;
}

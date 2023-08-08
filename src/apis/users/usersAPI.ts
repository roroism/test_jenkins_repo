import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { user, usersAPIResponse } from './usersAPI.models';

export async function getUsers() {
  const url = `${config.EXTERNAL.CUBLICK.USER.UDT}/`;
  const axiosConfig = createAuthConfig();
  const res = await axios.get<usersAPIResponse>(url, axiosConfig);
  return res.data;
}

export async function addUser(body: user) {
  const uri = config.EXTERNAL.CUBLICK.USER.UDT;
  const axiosConfig = createAuthConfig();
  delete body.id;
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export async function editUser(body: user) {
  console.log(body);
  const uri = `${config.EXTERNAL.CUBLICK.USER.UDT}/${body.id}`;
  const axiosConfig = createAuthConfig();
  delete body.id;
  const res = await axios.put(uri, body, axiosConfig);
  return res.data;
}

export async function editUserLanguage(body: {
  id: string;
  defLanguage: 'ko' | 'en' | 'de' | 'ja';
}) {
  const uri = `${config.EXTERNAL.CUBLICK.USER.UDT}/${body.id}`;
  const axiosConfig = createAuthConfig();
  delete body.id;
  const res = await axios.put(uri, body, axiosConfig);
  return res.data;
}

export async function changePassword(body: user) {
  if (body.password != body.passwordConfirm || body.password.length === 0) return;
  const uri = `${config.EXTERNAL.CUBLICK.USER.UDT}/${body.id}`;
  const axiosConfig = createAuthConfig();
  delete body.id;
  const res = await axios.put(uri, body, axiosConfig);
  return res.data;
}

export async function deleteUser(userId: string) {
  console.log(`deleting ${userId}`);
  const uri = config.EXTERNAL.CUBLICK.USER.UDT + '/' + userId;
  const axiosConfig = createAuthConfig();
  const res = await axios.delete(uri, axiosConfig);
  console.log(res);
  return res;
}

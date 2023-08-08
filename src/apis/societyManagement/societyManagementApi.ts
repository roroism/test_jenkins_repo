import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { AddSocietyRequestBody, SocietyManagementAPIResponse } from './societyManagementApi.model';

export async function getSocietyList(societyId: string) {
  const url = `${config.EXTERNAL.CUBLICK.SOCIETYMANAGEMENT.SELF}/${societyId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.get<SocietyManagementAPIResponse>(url, axiosConfig);
  return res.data;
}

export async function getSocietyManagement(societyId: string) {
  const url = `${config.EXTERNAL.CUBLICK.SOCIETYMANAGEMENT.SELF}/${societyId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.get<SocietyManagementAPIResponse>(url, axiosConfig);
  return res.data;
}

export async function addSociety(body: AddSocietyRequestBody) {
  const uri = config.EXTERNAL.CUBLICK.SOCIETYMANAGEMENT.ADD;
  const axiosConfig = createAuthConfig();
  console.log('addSociety body send before axios : ', body);
  console.log('addSociety axiosConfig send before axios : ', axiosConfig);
  console.log('addSociety uri send before axios : ', uri);
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

// export async function editGroupManagement(body: GroupManagement) {
//   const uri = `${config.EXTERNAL.CUBLICK.GROUPMANAGEMENT.SELF}/${body.id}`;
//   const axiosConfig = createAuthConfig();
//   delete body.id;
//   const res = await axios.put(uri, body, axiosConfig);
//   return res.data;
// }

export async function deleteSociety(societyId: string) {
  const uri = config.EXTERNAL.CUBLICK.SOCIETYMANAGEMENT.SELF + '/' + societyId;
  const axiosConfig = createAuthConfig();
  console.log('deleteSociety before axios : ', societyId);
  return;
  const res = await axios.delete(uri, axiosConfig);
  return res;
}
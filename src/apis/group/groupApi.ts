import axios from 'axios';
import { config } from '@app/src/config';
import { createAuthConfig, getAuthHeader } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { Group } from './groupApi.model';

export async function apiGroups(params: APIListParams) {
  const uri = config.EXTERNAL.CUBLICK.GROUP.BASE;
  const axiosConfig = createAuthConfig({ params });
  const res = await axios.get<APIList<Group>>(uri, axiosConfig);
  return res.data;
}

export function apiParentGroups(options: APIListParams): Promise<APIList<any>> {
  // Create api call body.
  const params = new URLSearchParams();
  if (options.filter) params.append('filter', JSON.stringify(options.filter));
  if (options.order) params.append('order', options.order);
  if (options.page) params.append('page', `${options.page}`);
  if (options.perPage) params.append('perPage', `${options.perPage}`);
  if (options.sort) params.append('sort', options.sort);

  return new Promise<APIList<any>>((resolve, reject) => {
    axios
      .get<APIList<any>>(config.EXTERNAL.CUBLICK.GROUP.PBASE, {
        headers: getAuthHeader(),
        params,
      })
      .then((res) => res.data)
      .then(resolve)
      .catch(reject);
  });
}

export async function addGroup(groupData: { name: string }) {
  const uri = config.EXTERNAL.CUBLICK.GROUP.BASE;
  const body = {
    name: groupData.name,
    isPrivate: true,
    status: 'ACTIVATED',
    contentType: 'DEVICE',
  };
  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export function addParentGroup(groupData: any): Promise<void> {
  const body = new URLSearchParams();

  body.append('name', groupData.name);
  body.append('isPrivate', 'true');
  body.append('status', 'ACTIVATED');
  body.append('contentType', 'DEVICE');

  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.GROUP.PBASE, body, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

export function deleteParentGroup(gorupId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .delete(config.EXTERNAL.CUBLICK.GROUP.PBASE + '/' + gorupId, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

export async function deleteGroup(groupId: string) {
  const uri = `${config.EXTERNAL.CUBLICK.GROUP.BASE}/${groupId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.delete(uri, axiosConfig);
  return res.data;
}

export function editGroup(groupData: any, groupId: string): Promise<void> {
  const body = new URLSearchParams();

  body.append('name', groupData);
  body.append('isPrivate', 'true');
  body.append('status', 'ACTIVATED');
  body.append('contentType', 'DEVICE');

  return new Promise((resolve, reject) => {
    axios
      .put(config.EXTERNAL.CUBLICK.GROUP.BASE + '/' + groupId, body, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

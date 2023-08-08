import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig, getAuthHeader } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { InstantMessageAPIResponse } from './instantMessageApi.model';

export async function apiInstantMessage(params: APIListParams) {
  const uri = config.EXTERNAL.CUBLICK.INSTANTMESSAGE.ISM;
  const axiosConfig = createAuthConfig({ params });
  const res = await axios.get<APIList<InstantMessageAPIResponse>>(uri, axiosConfig);
  return res.data;
}

/**
 * Get device data.
 * @param deviceId  Device ID.
 */
export function getInstantMessage(deviceId: string): Promise<InstantMessageAPIResponse> {
  return new Promise<InstantMessageAPIResponse>((resolve, reject) => {
    axios
      .get<InstantMessageAPIResponse>(`${config.EXTERNAL.CUBLICK.INSTANTMESSAGE.ISM}/${deviceId}`, {
        headers: getAuthHeader(),
      })
      .then((res) => res.data)
      .then(resolve)
      .catch(reject);
  });
}

// TODO: refactor required
export function createInstantMessageApi(value: any): Promise<void> {
  const body = new URLSearchParams();

  body.append('name', value.name);
  body.append('data', JSON.stringify(value.data));
  body.append('eventType', value.eventType);
  body.append('playTime', value.playTime);
  body.append('duration', value.duration);
  body.append('iDList', value.iDList);

  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.INSTANTMESSAGE.ISM, body, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

// TODO: refactor required
export function editInstantMessageApi(value: any, instantmsgId: String): Promise<void> {
  const body = new URLSearchParams();

  body.append('name', value.name);
  body.append('data', JSON.stringify(value.data));
  body.append('eventType', value.eventType);
  body.append('playTime', value.playTime);
  body.append('duration', value.duration);
  body.append('iDList', value.iDList);

  return new Promise((resolve, reject) => {
    axios
      .put(`${config.EXTERNAL.CUBLICK.INSTANTMESSAGE.ISM}/${instantmsgId}`, body, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

export async function sendInstantMsgToDevice(groups: any, deviceId: any, contentData: any) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;
  const body = new URLSearchParams();
  body.append('name', contentData.name);
  body.append('data', contentData.data);
  body.append('playTime', contentData.playTime);
  body.append('duration', contentData.duration);
  body.append('type', contentData.type);
  body.append('groups', JSON.stringify(groups));
  body.append('ids', JSON.stringify(deviceId));
  body.append('cmd', 'EXECUTE');
  const axiosConfig = createAuthConfig();

  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export function deleteInstantMessage(messageId: any): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .delete(config.EXTERNAL.CUBLICK.INSTANTMESSAGE.ISM + '/' + messageId, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

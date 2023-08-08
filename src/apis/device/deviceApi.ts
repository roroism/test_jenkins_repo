import { config } from '@app/src/config';
import axios from 'axios';
import { Asset } from '../assets';
import { CategoryAPIResponse } from '../category';
import { getContent } from '../content';
import { createAuthConfig, getAuthHeader } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { PresentationAPIResponse } from '../presentation/presentationApi.model';
import {
  DeviceAPISingleDevice,
  DevicesAPIDeviceResponse,
  DevicesAPIDeviceResult,
} from './deviceApi.model';

export async function getDevices(params: APIListParams) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SELF;
  const axiosConfig = createAuthConfig({ params });

  const response = await axios.get<APIList<DevicesAPIDeviceResponse>>(uri, axiosConfig);
  const res = response.data;

  const result: APIList<DevicesAPIDeviceResult> = {
    ...res,
    data: res.data.map((datum) => ({
      id: datum.id,
      name: datum.name,
      desc: datum.desc,
      owner: datum.owner.displayName,
      swVersion: datum.swVersion,
      playingContent: {
        type: datum.playingContent?.type || '',
        name: datum.playingContent?.name || '',
      },
      updatedDate: datum.updatedDate,
      liveStatus: datum.liveStatus,
      group: {
        id: datum.group?.id || '63e47b5eeb25d9165c77bd84',
        name: datum.group?.name || '265dc0064e22e32c522530f238c7bc1207f152',
      },
      category: datum.category,
      content: datum.content,
      status: datum.status,
      villageCode: datum.villageCode,
      orientation: datum.orientation,
      displayWidth: datum.displayWidth,
      displayHeight: datum.displayHeight,
    })),
  };

  return result;
}

export async function getAllDevices() {
  const deviceCountApi = await getDevices({ page: 1, perPage: 10 });
  const deviceCount = deviceCountApi.items.total;
  const allDevices = await getDevices({ page: 1, perPage: deviceCount });
  return allDevices;
}

/**
 * Get device data.
 * @param deviceId  Device ID.
 */
export async function getDevice(deviceId: string) {
  const uri = `${config.EXTERNAL.CUBLICK.DEVICE.SELF}/${deviceId}`;
  const axiosConfig = createAuthConfig();
  const response = await axios.get<DeviceAPISingleDevice>(uri, axiosConfig);
  return response.data;
}

/**
 * Get current device screen snapshot image.
 * @param deviceId  Device ID.
 */
export function getDeviceSnapshot(deviceId: string): Promise<Blob> {
  const date = Date.now();
  const url = new URL(`${config.EXTERNAL.CUBLICK.DEVICE.SELF}/${deviceId}/snapshot`);
  url.searchParams.append('access_token', getAuthHeader()['X-Access-Token']);
  url.searchParams.append('nocache', `${date}`);
  // url.searchParams.append('nocache', `${date}`);

  return new Promise<Blob>((resolve, reject) => {
    fetch(url.href)
      .then((res) => res.blob())
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Update device information.
 * @param deviceId      Device ID to update.
 * @param deviceInfo    Information to update.
 */
export async function updateDevice(deviceId: string, deviceInfo: { [key: string]: any } = {}) {
  const uri = `${config.EXTERNAL.CUBLICK.DEVICE.SELF}/${deviceId}`;
  const body = new URLSearchParams();
  Object.keys(deviceInfo).forEach((info) => body.append(info, deviceInfo[info]));
  const axiosConfig = createAuthConfig();
  const res = await axios.put<any>(uri, body, axiosConfig);
  return res.data;
}

export async function sendContentToDevice(groups: any, deviceIds: string[], contentData: any) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;

  const body = new URLSearchParams();
  body.append('id', contentData.id);
  body.append('name', contentData.name);
  body.append('category', JSON.stringify(contentData.category));
  body.append('option', contentData.option);
  body.append('type', contentData.type);
  body.append('groups', JSON.stringify(groups));
  body.append('ids', deviceIds.length === 1 ? deviceIds[0] : JSON.stringify(deviceIds));
  body.append('cmd', 'EXECUTE');

  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export async function sendPresentationToDeviceForAngularReplacement(
  deviceIds: string[],
  presentation: PresentationAPIResponse
) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;

  const body = new URLSearchParams();
  body.append('id', presentation.id);
  body.append('name', presentation.name);
  body.append('groups', JSON.stringify([]));
  body.append('ids', JSON.stringify(deviceIds));
  body.append('cmd', 'EXECUTE');
  body.append('type', 'PRESENTATION');

  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export async function sendPresentationToDeviceForNormal(
  deviceIds: string[],
  presentation: PresentationAPIResponse,
  startDate: string,
  endDate: string,
  category: CategoryAPIResponse
  // isWidgetEnabled: string,
  // isCategoryEnabled: string
) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;

  const body = new URLSearchParams();
  body.append('id', presentation.id);
  body.append('name', presentation.name);
  body.append('groups', JSON.stringify([]));
  body.append('ids', deviceIds.length === 1 ? deviceIds[0] : JSON.stringify(deviceIds));
  body.append('cmd', 'EXECUTE');
  body.append('type', 'PRESENTATION');
  body.append('option', 'ADD');
  //body.append('data', JSON.stringify(presentation));
  body.append('category', JSON.stringify({ id: category.id, name: category.name }));
  body.append('startDate', startDate);
  body.append('endDate', endDate);
  // body.append('isWidgetEnabled', isWidgetEnabled);
  // body.append('isCategoryEnabled', isCategoryEnabled);

  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export async function sendAssetToDevice(
  deviceId: string[],
  asset: Asset,
  startDate: string,
  endDate: string,
  category: CategoryAPIResponse
  // isWidgetEnabled: string,
  // isCategoryEnabled: string
) {
  const url = config.EXTERNAL.CUBLICK.DEVICE.SEND;

  const body = new URLSearchParams();
  body.append('startDate', startDate);
  body.append('endDate', endDate);
  body.append('category', JSON.stringify({ id: category.id, name: category.name }));
  body.append('id', asset.id);
  body.append('name', asset.name);
  body.append('mimeType', asset.mimeType);
  body.append('width', asset.width.toString());
  body.append('option', 'ADD');
  body.append('height', asset.height.toString());
  body.append('groups', JSON.stringify([]));
  body.append('ids', JSON.stringify(deviceId));
  body.append('cmd', 'EXECUTE');
  body.append('type', 'ASSET');
  // body.append('isWidgetEnabled', isWidgetEnabled);
  // body.append('isCategoryEnabled', isCategoryEnabled);

  const axiosConfig = createAuthConfig();
  const res = await axios.post(url, body, axiosConfig);
  return res.data;
}

export async function sendCategoryToDevice(groups: any, deviceIds: string[], CategoryData: any) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;

  const body = new URLSearchParams();
  body.append('id', CategoryData.id);
  body.append('name', CategoryData.name);
  body.append('type', CategoryData.type);
  body.append('option', CategoryData.option);
  body.append('groups', JSON.stringify(groups));
  body.append('ids', deviceIds.length === 1 ? deviceIds[0] : JSON.stringify(deviceIds));
  body.append('cmd', 'EXECUTE');

  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export function sendSnapShotToDevice(deviceId: any[]): Promise<any> {
  const body = new URLSearchParams();

  body.append('ids', JSON.stringify(deviceId));
  body.append('cmd', 'SNAPSHOT');

  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.DEVICE.SEND, body, {
        headers: getAuthHeader(),
      })
      .then(resolve)
      .catch(reject);
  });
}

export function activateDeivce(deviceData: any): Promise<void> {
  const body = new URLSearchParams();

  body.append('pinCode', deviceData.pinCode);

  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.DEVICE.ACTI, body, {
        headers: getAuthHeader(),
      })
      .then((res) => res.data)
      .then(resolve)
      .catch(reject);
  });
}

export function editDevice(deviceData: any, device: any): Promise<void> {
  const body = new URLSearchParams();
  console.log('deviceData, device : ', deviceData, device);

  body.append('name', deviceData.name); // {pinCode, name, desc, address, villageCode}
  body.append('desc', deviceData.desc);
  body.append('address', deviceData.address);
  body.append('orientation', deviceData.orientation);
  // body.append('villageCode', deviceData.villageCode);

  return new Promise((resolve, reject) => {
    axios
      .put(config.EXTERNAL.CUBLICK.DEVICE.SELF + '/' + device.id, body, {
        headers: getAuthHeader(),
      })
      .then((res) => res.data)
      .then(resolve)
      .catch(reject);
  });
}

export function editDevice2(deviceData: any): Promise<void> {
  const body = new URLSearchParams();

  body.append('name', deviceData.name);
  body.append('desc', deviceData.desc);
  body.append('address', deviceData.address);
  body.append('isCategoryVisible', deviceData.isCategoryVisible);
  body.append('isWidgetVisible', deviceData.isWidgetVisible);
  body.append('builtinWidgetAddress', deviceData.builtinWidgetAddress);
  body.append('orientation', deviceData.orientation);
  body.append('autoScale', deviceData.autoScale);

  return new Promise((resolve, reject) => {
    axios
      .put(config.EXTERNAL.CUBLICK.DEVICE.SELF + '/' + deviceData.id, body, {
        headers: getAuthHeader(),
      })
      .then((res) => res.data)
      .then(resolve)
      .catch(reject);
  });
}

export function assignGroup(device: any, groupId: string): Promise<void> {
  const body = new URLSearchParams();

  body.append('groupId', groupId);

  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.DEVICE.SELF + '/' + device.id + '/assign_group', body, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

export function deleteDevice(deviceId: any): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .delete(config.EXTERNAL.CUBLICK.DEVICE.SELF + '/' + deviceId, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

export async function updateSoftware(pinCodes: string[]): Promise<void> {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;
  const body = {
    cmd: 'UPGRADE',
    pinCodes: pinCodes,
  };
  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

export function multiUpdateSoftware(ids: any[]): Promise<void> {
  const body = new URLSearchParams();

  body.append('ids', JSON.stringify(ids));
  body.append('cmd', 'UPGRADE');

  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.DEVICE.SEND, body, {
        headers: getAuthHeader(),
      })
      .then(() => resolve())
      .catch(reject);
  });
}

export function getDeviceData(deviceId: any): Promise<any> {
  const body = new URLSearchParams();

  body.append('cmd', deviceId.latest);
  body.append('deviceId', deviceId.deviceIdData);
  return new Promise((resolve, reject) => {
    axios
      .post(config.EXTERNAL.CUBLICK.DEVICE.SEND, body, {
        headers: getAuthHeader(),
      })
      .then(resolve)
      .catch(reject);
  });
}

export async function deletePlayingPresentation(
  contentId: string,
  contentName: string,
  category: { id: string; name: string },
  deviceId: string
) {
  const url = config.EXTERNAL.CUBLICK.DEVICE.SEND;
  const body = {
    id: contentId,
    name: contentName,
    category: category,
    option: 'REMOVE',
    type: 'PRESENTATION',
    groups: [],
    ids: [deviceId],
    cmd: 'EXECUTE',
  };
  const axiosConfig = createAuthConfig();
  await axios.post(url, body, axiosConfig);
}

export async function deletePlayingAsset(
  contentId: string,
  contentName: string,
  startDate: string,
  endDate: string,
  deviceId: string,
  category: { id: string; name: string }
) {
  const url = config.EXTERNAL.CUBLICK.DEVICE.SEND;
  const body = {
    id: contentId,
    name: contentName,
    startDate: startDate,
    endDate: endDate,
    category: category,
    option: 'REMOVE',
    type: 'ASSET',
    groups: [],
    ids: [deviceId],
    cmd: 'EXECUTE',
  };
  const axiosConfig = createAuthConfig();
  await axios.post(url, body, axiosConfig);
}

export async function deletePlayingContent(
  contentId: string,
  contentName: string,
  category: { id: string; name: string },
  deviceId: string
) {
  const url = config.EXTERNAL.CUBLICK.DEVICE.SEND;
  const body = {
    id: contentId,
    name: contentName,
    category: category,
    option: 'REMOVE',
    type: 'CONTENTMANAGEMENT', //이미지, 비디오, 위젯에 따라 분리해야 하나..? 그럼 DeviceInfo에서도 조건문 나눠야 할 듯
    groups: [],
    ids: [deviceId],
    cmd: 'EXECUTE',
  };
  const axiosConfig = createAuthConfig();
  await axios.post(url, body, axiosConfig);

  const content = await getContent(contentId);

  const url2 = `${config.EXTERNAL.CUBLICK.CONTENT.SELF}/${contentId}`;
  const body2 = {
    playingDevices: JSON.stringify(
      content.playingDevices.filter((item) => item.deviceId !== deviceId)
    ),
  };
  const axiosConfig2 = createAuthConfig();
  await axios.put(url2, body2, axiosConfig2);
  return 'SUCCESS';
}

export async function sendInstantMessageToDevice(groups: any, deviceIds: string[], ImsData: any) {
  const uri = config.EXTERNAL.CUBLICK.DEVICE.SEND;

  const body = new URLSearchParams();
  body.append('name', ImsData.name);
  body.append('playTime', ImsData.playTime);
  body.append('duration', ImsData.duration);
  body.append('type', ImsData.type);
  body.append('option', ImsData.option);
  body.append('groups', JSON.stringify(groups));
  body.append('ids', deviceIds.length === 1 ? deviceIds[0] : JSON.stringify(deviceIds));
  body.append('cmd', ImsData.cmd);
  body.append('data', JSON.stringify(ImsData));

  const axiosConfig = createAuthConfig();
  const res = await axios.post(uri, body, axiosConfig);
  return res.data;
}

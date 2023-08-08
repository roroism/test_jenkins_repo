import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { StorageData, TotalContent, TotalDevice } from './homeApi.model';

export async function getTotalContent() {
  const uri = config.EXTERNAL.CUBLICK.HOME.CONT;
  const axiosConfig = createAuthConfig();
  const { data } = await axios.get<TotalContent>(uri, axiosConfig);
  return data;
}

export async function getTotalDevice() {
  const uri = config.EXTERNAL.CUBLICK.HOME.DEVS;
  const axiosConfig = createAuthConfig();
  const { data } = await axios.get<TotalDevice>(uri, axiosConfig);
  return data;
}

export async function getStorageData() {
  const uri = config.EXTERNAL.CUBLICK.HOME.STOR;
  const axiosConfig = createAuthConfig();
  const { data } = await axios.get<StorageData>(uri, axiosConfig);

  const storageData: StorageData = {
    totalStorage: data.totalStorage,
    usedStorage: data.usedStorage,
    eCoinX: data.eCoinX,
    eCoinF: data.eCoinF,
    expiredDate: data.expiredDate,
  };
  return storageData;
}

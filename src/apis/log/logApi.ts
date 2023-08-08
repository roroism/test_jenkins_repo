import { config } from '@app/src/config';
import axios from 'axios';
import { createAuthConfig } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import type { LogAPILogResponse } from './logApi.model';

export async function apiSystemLogs(params: APIListParams) {
  const uri = config.EXTERNAL.CUBLICK.SYSTEMLOGS.SYSLOG;
  const axiosConfig = createAuthConfig({ params });
  const res = await axios.get<any>(uri, axiosConfig);
  return res.data;
}

export async function apiTransmissionLogs(params: APIListParams) {
  const uri = config.EXTERNAL.CUBLICK.SYSTEMLOGS.TRANSLOG;
  const axiosConfig = createAuthConfig({ params });
  const res = await axios.get<APIList<LogAPILogResponse>>(uri, axiosConfig);
  console.log('apiTransmissionLogs res : ', res);
  return res.data;
}

export async function deleteLog(logId: string) {
  const uri = `${config.EXTERNAL.CUBLICK.SYSTEMLOGS.TRANSLOG}/${logId}`;
  const axiosConfig = createAuthConfig();
  const res = await axios.delete<any>(uri, axiosConfig);
  return res.data;
}

export async function apiErrorLogs(params: APIListParams) {
  const uri = config.EXTERNAL.CUBLICK.SYSTEMLOGS.ERROR;
  const axiosConfig = createAuthConfig({ params });
  const res = await axios.get<any>(uri, axiosConfig);
  return res.data;
}

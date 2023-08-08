import { config } from '@app/src/config';
import axios from 'axios';
import {
  AuthAPIPasswordResetEmailRequestParams,
  AuthAPISignInParams,
  AuthAPISignInResponse,
  AuthAPISignUpParams,
} from './authApi.model';

export async function fetchSignIn(credentials: AuthAPISignInParams) {
  const uri = config.EXTERNAL.CUBLICK.AUTH.SIGN_IN;
  const body = credentials;
  const res = await axios.post<AuthAPISignInResponse>(uri, body);
  return res;
}

export function fetchSignUp(contentData: AuthAPISignUpParams) {
  const url = 'http://localhost:8080/v1/users'; //'https://api-service.cublick.com/v1/users'; //config.EXTERNAL.CUBLICK.REGIST.REGIST_IN;   when local server is ready, change back to config
  console.log(url);
  const body = contentData;
  return axios.post(url, body);
}

export function passwordResetEmailRequest(contentData: AuthAPIPasswordResetEmailRequestParams) {
  const url = config.EXTERNAL.CUBLICK.FORGET.FORGET_IN;
  const body = contentData;
  return axios.post(url, body);
}

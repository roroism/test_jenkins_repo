import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppAuthState, UserData } from '../model';
import { ReduxRootState } from '../store';

const initialState: AppAuthState = {
  token: null,
  userData: {
    name: '',
    email: '',
    userRight: '',
    avatarUrl: '',
    lang: 'ko',
    id: '',
  },
};

type userData = {
  name: string;
  email: string;
  userRight: string;
  avatarUrl: string;
  lang: string;
  id: string;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInSuccess: (state, action: PayloadAction<AppAuthState>) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    profileEditSucess: (
      state,
      action: PayloadAction<{ id: string; lang: string; email: string; name: string }>
    ) => {
      state.userData.id = action.payload.id;
      state.userData.lang = action.payload.lang;
      state.userData.email = action.payload.email;
      state.userData.name = action.payload.name;
    },
    signOut: (state) => {
      state.token = initialState.token;
      state.userData = initialState.userData;
    },
  },
});

export const authActions = authSlice.actions;

export const selectToken = () => (root: ReduxRootState) => root.appAuth.token;
export const selectUserData = () => (root: ReduxRootState) => root.appAuth.userData;
export const selectUserDataByKey = <T extends keyof UserData>(key: T) => {
  return (root: ReduxRootState) => root.appAuth.userData[key];
};

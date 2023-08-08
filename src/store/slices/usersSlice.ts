import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppAuthState, UserData } from '../model';
import { ReduxRootState } from '../store';
import { usersAPIResponse } from '@app/src/apis/users';

const initialState: usersAPIResponse[] = [];

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersFetchSucess: (state, action: PayloadAction<usersAPIResponse[]>) => {
      state = action.payload;
    },
  },
});

export const authActions = usersSlice.actions;

export const selectToken = () => (root: ReduxRootState) => root.appAuth.token;
export const selectUserData = () => (root: ReduxRootState) => root.appAuth.userData;
export const selectUserDataByKey = <T extends keyof UserData>(key: T) => {
  return (root: ReduxRootState) => root.appAuth.userData[key];
};

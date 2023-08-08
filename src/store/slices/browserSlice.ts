import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReduxRootState } from '../store';

type darkThemeData = {
  isDarkTheme: boolean | null;
};

const initialState = {
  isDarkTheme: null,
};

export const browserSlice = createSlice({
  name: 'browserInfo',
  initialState,
  reducers: {
    addDarkThemeData: (state, action: PayloadAction<darkThemeData>) => {
      state.isDarkTheme = action.payload.isDarkTheme;
    },
  },
});

export const browserActions = browserSlice.actions;

export const selectDarkTheme = () => (root: ReduxRootState) => root.browserInfo.isDarkTheme;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalType } from '../model';
import { ReduxRootState } from '../store';

const initialState: ModalType[] = [];

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<ModalType>) => {
      state.push(action.payload);
    },
    close: (state, action: PayloadAction<number>) => {
      const key = action.payload;
      const index = state.findIndex((modal) => modal.key === key);
      if (index !== -1) state.splice(index, 1);
    },
    closeAll: (state) => {
      return initialState;
    },
  },
});

export const selectModals = () => (state: ReduxRootState) => state.modals;

export const modalActions = modalSlice.actions;

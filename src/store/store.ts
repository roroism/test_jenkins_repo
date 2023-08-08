import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/es/storage';
import sessionStorage from 'redux-persist/es/storage/session';
import { StateType } from 'typesafe-actions';
import { authSlice } from './slices/authSlice';
import { cartSlice } from './slices/cartSlice';
import { modalSlice } from './slices/modalSlice';
import { browserSlice } from './slices/browserSlice';

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['cartList', 'appAuth', 'appMenu', 'router', 'browserInfo'],
};

const browserInfoConfig = {
  key: 'browserInfo',
  storage: storage,
};

const rootReducer = combineReducers({
  appAuth: authSlice.reducer,
  modals: modalSlice.reducer,
  cartList: cartSlice.reducer,
  browserInfo: persistReducer(browserInfoConfig, browserSlice.reducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }),
});

export type ReduxRootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);

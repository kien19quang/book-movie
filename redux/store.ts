import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { Action, combineReducers, Reducer } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';
import { authSlice } from './slices/authSlice';
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from 'redux-persist';
import { pageSlice } from './slices/pageSlice';
import { useStore } from 'react-redux';

const initialState = {}

const combinedReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [pageSlice.name]: pageSlice.reducer
});

const makeConfiguredStore = (reducer: Reducer, initialState: {}, isServer: boolean) => {
  const middlewares = [];
  if (!isServer) middlewares.push(thunkMiddleware);
  // if (process.env.NODE_ENV === 'development') middlewares.push(logger);

  return configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development',
    middleware: middlewares,
  });
};

const makeStore = () => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return makeConfiguredStore(combinedReducer, initialState, false);
  }

  else {
    const persistConfig = {
      key: 'root',
      storage: storage,
      timeout: null,
      debug: process.env.NODE_ENV === 'development',
      whitelist: [pageSlice.name]
    } as any
    const persistedReducer = persistReducer(persistConfig, combinedReducer);
    const store: any = makeConfiguredStore(persistedReducer, initialState, isServer);
    store.__isClient = true;
    store.__persistor = persistStore(store)
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(makeStore);

import { combineReducers } from 'redux';
import { LOGOUT } from '../Actions/types';
import RegisterReducer from './RegisterReducer';
import WalletReducer from './WalletReducer';
import SendCoinReducer from './SendCoinReducer';
import AddCustomTokenReducer from './AddCustomTokenReducer';
import MultiSenderReducer from './MultiSenderReducer';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['walletReducer']
}

const appReducer = combineReducers({
  registerReducer: RegisterReducer,
  walletReducer: WalletReducer,
  sendCoinReducer: SendCoinReducer,
  addCustomTokenReducer: AddCustomTokenReducer,
  multiSenderReducer: MultiSenderReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = createStore(rootReducer, {}, applyMiddleware(ReduxThunk));


export  const store = createStore(persistedReducer,  {}, applyMiddleware(ReduxThunk))
export  const persistor = persistStore(store)
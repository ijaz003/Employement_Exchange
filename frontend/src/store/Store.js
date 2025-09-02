import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserReducers'; // adjust path if needed
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import NotificationReducer from './NotificationReducer'; 




const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);


const store = configureStore({
  reducer:{
    user:persistedReducer,
    notifications:NotificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),

});
export const persistor = persistStore(store);

export default store;

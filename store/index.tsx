import {combineReducers, configureStore} from '@reduxjs/toolkit';
import themeConfigSlice from './slices/themeConfigSlice';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import {persistReducer, persistStore} from 'redux-persist';
import userReducer from './slices/userSlice';
import unitReducer from './slices/unitSlice';
import rawProduct from './slices/rawProductSlice';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['unit', 'rawProduct'],
};

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    user: userReducer,
    unit: unitReducer,
    rawProduct: rawProduct,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            },
        }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
// export default configureStore({
//     reducer: rootReducer,
// });

export type IRootState = ReturnType<typeof rootReducer>;

import {configureStore} from '@reduxjs/toolkit';
import persistedReducer from '@/store/persistor';
import {persistStore} from "redux-persist";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {rootReducer} from "@/store/reducers";

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
export type IRootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;

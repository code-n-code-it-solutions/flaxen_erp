import { configureStore } from '@reduxjs/toolkit';
import persistedReducer from '@/store/persistor';
import { persistStore } from "redux-persist";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { rootReducer } from "@/store/reducers";

const isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development';

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const middlewares = getDefaultMiddleware({
            serializableCheck: isDevelopment ? {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
            } : false,
            immutableCheck: isDevelopment ? { warnAfter: 64 } : false,  // Increase threshold or disable
        });
        return middlewares;
    },
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;

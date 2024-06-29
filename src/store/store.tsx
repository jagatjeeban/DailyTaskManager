import { configureStore } from "@reduxjs/toolkit";
import persistedReducer from "./rootReducer";
import { persistStore } from "redux-persist";

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleWare) => 
        getDefaultMiddleWare({
            immutableCheck: false,
            serializableCheck: false
        })
})

export type DispatchType = typeof store.dispatch;
export type RootStateType = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);
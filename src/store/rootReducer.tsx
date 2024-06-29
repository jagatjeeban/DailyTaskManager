import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "./authSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";

const storage = AsyncStorage;

const persistConfig = {
    key: 'root',
    storage
}

const authConfig = {
    key: 'auth',
    storage
}

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, auth)
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
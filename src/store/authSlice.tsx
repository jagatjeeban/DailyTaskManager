import { createSlice } from "@reduxjs/toolkit";
interface AuthState {
    loginStatus: boolean,
}

const initialState: AuthState = {
    loginStatus: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state){
            state.loginStatus = true;
        },
        logOutEvent(state){
            state.loginStatus = false;
        }
    }
});

export const { loginSuccess, logOutEvent } = authSlice.actions;
export default authSlice.reducer;
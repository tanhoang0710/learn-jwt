import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		login: {
			currentUser: null,
			isFetching: false,
			error: false,
		},
		register: {
			isFetching: false,
			error: false,
			success: false,
		},
	},
	reducers: {
		loginStart: (state) => {
			state.login.isFetching = true;
		},
		loginSuccess: (state, action) => {
			state.login.isFetching = true;
			state.login.currentUser = action.payload;
			state.login.error = false;
		},
		loginFailed: (state) => {
			state.login.isFetching = false;
			state.login.error = true;
		},
		registerStart: (state) => {
			state.register.isFetching = true;
		},
		registerSuccess: (state) => {
			state.register.isFetching = false;
			state.register.error = false;
			state.register.success = true;
		},
		registerFailed: (state) => {
			state.register.isFetching = false;
			state.register.error = true;
			state.register.success = false;
		},
		logOutStart: (state) => {
			state.login.isFetching = true;
		},
		logOutSuccess: (state, action) => {
			state.login.isFetching = false;
			state.login.error = false;
			state.login.currentUser = null;
		},
		logOutFailed: (state) => {
			state.login.isFetching = false;
			state.login.error = true;
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailed,
	registerFailed,
	registerStart,
	registerSuccess,
	logOutFailed,
	logOutStart,
	logOutSuccess,
} = authSlice.actions;

export default authSlice.reducer;

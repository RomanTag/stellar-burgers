import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';

export const register = createAsyncThunk('user/register', registerUserApi);
export const login = createAsyncThunk('user/login', loginUserApi);
export const apiGetUser = createAsyncThunk('user/getUser', getUserApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);
export const logout = createAsyncThunk('user/logout', logoutApi);

export interface TUserState {
  isAuthChecked: boolean;
  user: TUser;
  error: string | undefined;
}

export const initialState: TUserState = {
  isAuthChecked: false,
  user: {
    email: '',
    name: ''
  },
  error: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.error = undefined;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message ?? 'Неизвестная ошибка';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.error = undefined;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message ?? 'Неизвестная ошибка';
      })
      .addCase(apiGetUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload.user;
      })
      .addCase(apiGetUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.error = action.error.message ?? 'Неизвестная ошибка';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Неизвестная ошибка';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthChecked = false;
        state.user = { email: '', name: '' };
      });
  }
});

// Селекторы
export const isAuthCheckedSelector = (state: { user: TUserState }) =>
  state.user.isAuthChecked;
export const getUser = (state: { user: TUserState }): TUser => state.user.user;
export const getName = (state: { user: TUserState }): string =>
  state.user.user.name;
export const getError = (state: TUserState) => state.error;

export default userSlice.reducer;

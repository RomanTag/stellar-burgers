import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  userSlice,
  register,
  login,
  apiGetUser,
  updateUser,
  logout,
  isAuthCheckedSelector,
  getUser,
  getName,
  getError,
  initialState
} from '../slices/user';
import { userMockData, userResponce } from '../testData';

describe('userSlice тесты', () => {
  const stateConstructor = (action: { type: string; payload?: {} }) =>
    userSlice.reducer(initialState, action);

  test('Селекторы isAuthCheckedSelector, getUser, getName, getError', () => {
    const store = configureStore({
      reducer: {
        user: userSlice.reducer
      },
      preloadedState: {
        user: userMockData
      }
    });

    const isAuthChecked = isAuthCheckedSelector(store.getState());
    const user = getUser(store.getState());
    const name = getName(store.getState());
    const error = getError(store.getState().user);

    expect(isAuthChecked).toEqual(userMockData.isAuthChecked);
    expect(user).toEqual(userMockData.user);
    expect(name).toEqual(userMockData.user.name);
    expect(error).toEqual(userMockData.error);
  });

  test('Тест редьюсера register.fulfilled', () => {
    const action = {
      type: register.fulfilled.type,
      payload: userResponce
    };
    const newState = stateConstructor(action);

    expect(newState.isAuthChecked).toBe(true);
    expect(newState.user).toEqual(userResponce.user);
    expect(newState.error).toBeUndefined();
  });

  test('Тест редьюсера register.rejected', () => {
    const action = {
      type: register.rejected.type,
      error: { message: 'Ошибка при регистрации' }
    };
    const newState = stateConstructor(action);

    expect(newState.error).toEqual('Ошибка при регистрации');
  });

  test('Тест редьюсера login.fulfilled', () => {
    const action = {
      type: login.fulfilled.type,
      payload: userResponce
    };
    const newState = stateConstructor(action);

    expect(newState.isAuthChecked).toBe(true);
    expect(newState.user).toEqual(userResponce.user);
    expect(newState.error).toBeUndefined();
  });

  test('Тест редьюсера login.rejected', () => {
    const action = {
      type: login.rejected.type,
      error: { message: 'Ошибка при входе' }
    };
    const newState = stateConstructor(action);

    expect(newState.error).toEqual('Ошибка при входе');
  });

  test('Тест редьюсера apiGetUser.fulfilled', () => {
    const action = {
      type: apiGetUser.fulfilled.type,
      payload: userResponce
    };
    const newState = stateConstructor(action);

    expect(newState.isAuthChecked).toBe(true);
    expect(newState.user).toEqual(userResponce.user);
  });

  test('Тест редьюсера apiGetUser.rejected', () => {
    const action = {
      type: apiGetUser.rejected.type,
      error: { message: 'Ошибка получения данных пользователя' }
    };
    const newState = stateConstructor(action);

    expect(newState.isAuthChecked).toBe(false);
    expect(newState.error).toEqual('Ошибка получения данных пользователя');
  });

  test('Тест редьюсера updateUser.fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: userResponce
    };
    const newState = stateConstructor(action);

    expect(newState.user).toEqual(userResponce.user);
  });

  test('Тест редьюсера updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'Ошибка обновления данных пользователя' }
    };
    const newState = stateConstructor(action);

    expect(newState.error).toEqual('Ошибка обновления данных пользователя');
  });

  test('Тест редьюсера logout.fulfilled', () => {
    const action = {
      type: logout.fulfilled.type
    };
    const newState = stateConstructor(action);

    expect(newState.isAuthChecked).toBe(false);
    expect(newState.user).toEqual({ email: '', name: '' });
  });
});

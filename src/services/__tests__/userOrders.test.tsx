import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { ordersMockData } from '../testData';
import {
  listOfOrders,
  initialState,
  userOrdersSlice,
  getUserOrders
} from '../slices/userOrders';

describe('тестируем orders', () => {
  test('тест селектора listOfOrders', () => {
    const store = configureStore({
      reducer: {
        orders: userOrdersSlice.reducer
      },
      preloadedState: {
        orders: ordersMockData
      }
    });

    // Получение состояния из store
    const orderRequest = listOfOrders(store.getState());

    expect(orderRequest).toEqual(ordersMockData.orders);
  });

  test('Тест редьюсера getUserOrders - fulfilled', () => {
    const newState = userOrdersSlice.reducer(
      initialState,
      getUserOrders.fulfilled(ordersMockData.orders, '')
    );
    expect(newState.orders).toEqual(ordersMockData.orders);
    expect(newState.isLoading).toEqual(false);
  });

  test('Тест редьюсера getUserOrders - rejected', () => {
    const newState = userOrdersSlice.reducer(
      initialState,
      getUserOrders.rejected(new Error('error'), '', undefined)
    );
    expect(newState.isLoading).toEqual(false);
  });

  test('Тест редьюсера getUserOrders - pending', () => {
    const newState = userOrdersSlice.reducer(
      initialState,
      getUserOrders.pending('', undefined)
    );
    expect(newState.isLoading).toEqual(true);
  });
});

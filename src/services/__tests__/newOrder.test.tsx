import { describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  newOrderSlice,
  placeNewOrder,
  initialState,
  resetOrder,
  getOrderRequest,
  getOrderModalData
} from '../slices/newOrder';
import { orderMockData, orderReceivedMockData } from '../testData';

describe('newOrderSlice тесты', () => {
  test('Селекторы getOrderRequest и getOrderModalData', () => {
    const store = configureStore({
      reducer: {
        newOrder: newOrderSlice.reducer
      },
      preloadedState: {
        newOrder: orderMockData
      }
    });

    const orderRequest = getOrderRequest(store.getState());
    const modal = getOrderModalData(store.getState());

    expect(orderRequest).toEqual(orderMockData.orderRequest);
    expect(modal).toEqual(orderMockData.orderModalData);
  });

  test('Тест редьюсера resetOrder', () => {
    const state = {
      orderRequest: true,
      orderModalData: orderReceivedMockData.order,
      error: 'Ошибка'
    };

    const stateAfterReset = newOrderSlice.reducer(state, resetOrder());
    expect(stateAfterReset).toEqual(initialState);
  });

  test('Тест редьюсера placeNewOrder.fulfilled', () => {
    const newState = newOrderSlice.reducer(
      initialState,
      placeNewOrder.fulfilled(orderReceivedMockData, '', [])
    );

    expect(newState.orderRequest).toEqual(false);
    expect(newState.orderModalData).toEqual(orderReceivedMockData.order);
  });

  test('Тест редьюсера placeNewOrder.rejected', () => {
    const newState = newOrderSlice.reducer(
      initialState,
      placeNewOrder.rejected(new Error('Ошибка'), '', [])
    );

    expect(newState.error).toEqual('Ошибка');
  });

  test('Тест редьюсера placeNewOrder.pending', () => {
    const newState = newOrderSlice.reducer(
      initialState,
      placeNewOrder.pending('', [])
    );

    expect(newState.orderRequest).toEqual(true);
  });
});

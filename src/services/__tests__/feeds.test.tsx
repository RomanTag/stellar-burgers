import { describe, expect, test } from '@jest/globals';
import {
  feedsSlice,
  getAllFeeds,
  getOrdersFeeds,
  getTotalFeeds,
  getTotalTodayFeeds,
  initialState
} from '../slices/feeds';
import { configureStore } from '@reduxjs/toolkit';
import { feedsMockData } from '../testData';

describe('тесты feedsSlice', () => {
  test('тесты селекторов getOrdersFeeds, getTotalFeeds, getTotalTodayFeeds', () => {
    const store = configureStore({
      reducer: {
        feeds: feedsSlice.reducer
      },
      preloadedState: {
        feeds: feedsMockData
      }
    });
    const orders = getOrdersFeeds(store.getState());
    const total = getTotalFeeds(store.getState());
    const totalToday = getTotalTodayFeeds(store.getState());

    // Проверка, что селекторы возвращают правильные данные
    expect(orders).toEqual(feedsMockData.orders);
    expect(total).toEqual(feedsMockData.total);
    expect(totalToday).toEqual(feedsMockData.totalToday);
  });

  test('Тесты редьюсера getAllFeeds, проверка fulfilled', () => {
    const action = {
      type: getAllFeeds.fulfilled.type,
      payload: feedsMockData
    };
    const stateReceived = feedsSlice.reducer(initialState, action);

    // Проверка состояния после успешного выполнения запроса
    expect(stateReceived.orders).toEqual(feedsMockData.orders);
    expect(stateReceived.total).toEqual(feedsMockData.total);
    expect(stateReceived.totalToday).toEqual(feedsMockData.totalToday);
    expect(stateReceived.isLoading).toEqual(false);
  });

  test('Тесты редьюсера getAllFeeds, проверка rejected', () => {
    const error = new Error('error');
    const stateReceived = feedsSlice.reducer(
      initialState,
      getAllFeeds.rejected(error, '')
    );

    // Проверка состояния после отклоненного запроса
    expect(stateReceived.orders).toEqual([]);
    expect(stateReceived.total).toEqual(0);
    expect(stateReceived.totalToday).toEqual(0);
    expect(stateReceived.isLoading).toEqual(false);
    expect(stateReceived.error).toEqual('error');
  });

  test('Тесты редьюсера getAllFeeds, проверка pending', () => {
    const stateReceived = feedsSlice.reducer(
      initialState,
      getAllFeeds.pending('')
    );

    // Проверка состояния при ожидании выполнения запроса
    expect(stateReceived.isLoading).toEqual(true);
  });
});

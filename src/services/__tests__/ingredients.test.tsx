import { describe, expect, test } from '@jest/globals';
import {
  getIngredients,
  getIngredientsList,
  getIngredientsLoadingState,
  getIngredientsState,
  ingredientsSlice,
  initialState
} from '../slices/ingredients.tsx';
import { configureStore } from '@reduxjs/toolkit';
import { ingredientsMockData } from '../testData';

describe('тесты ingredientsSlice', () => {
  test('должно возвращать начальное состояние', () => {
    const state = ingredientsSlice.reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  test('тесты селекторов getIngredientsState, getIngredientsLoadingState, getIngredients', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsSlice.reducer
      },
      preloadedState: {
        ingredients: ingredientsMockData
      }
    });

    const ingredientsState = getIngredientsState(store.getState());
    const loading = getIngredientsLoadingState(store.getState());
    const ingredients = getIngredients(store.getState());

    expect(ingredientsState).toEqual(ingredientsMockData);
    expect(loading).toEqual(ingredientsMockData.loading);
    expect(ingredients).toEqual(ingredientsMockData.ingredients);
  });

  test('тест редьюсера getIngredientsList: fulfilled', () => {
    const action = {
      type: getIngredientsList.fulfilled.type,
      payload: ingredientsMockData.ingredients
    };
    const stateReceived = ingredientsSlice.reducer(initialState, action);

    expect(stateReceived.ingredients).toEqual(ingredientsMockData.ingredients);
    expect(stateReceived.loading).toEqual(false);
    expect(stateReceived.error).toBeNull();
  });

  test('тест редьюсера getIngredientsList: rejected', () => {
    const errorMessage = 'Ошибка тестирования';
    const action = {
      type: getIngredientsList.rejected.type,
      error: { message: errorMessage }
    };
    const stateReceived = ingredientsSlice.reducer(initialState, action);

    expect(stateReceived.ingredients).toEqual([]);
    expect(stateReceived.loading).toEqual(false);
    expect(stateReceived.error).toEqual(errorMessage);
  });

  test('тест редьюсера getIngredientsList: pending', () => {
    const action = { type: getIngredientsList.pending.type };
    const stateReceived = ingredientsSlice.reducer(initialState, action);

    expect(stateReceived.loading).toEqual(true);
    expect(stateReceived.error).toBeNull();
    expect(stateReceived.ingredients).toEqual([]);
  });

  test('неизвестное действие не должно менять состояние', () => {
    const state = ingredientsSlice.reducer(initialState, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});

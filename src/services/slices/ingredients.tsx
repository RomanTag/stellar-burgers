import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Создание асинхронного действия для получения списка ингредиентов
export const getIngredientsList = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

type TIngredientsState = {
  ingredients: Array<TIngredient>;
  loading: boolean;
  error: string | null | undefined;
};

// Начальное состояние для слайса ингредиентов
export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

// Создание слайса для управления состоянием ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Обработка дополнительных действий, созданных с помощью createAsyncThunk
    builder
      .addCase(getIngredientsList.pending, (state) => {
        // Действие выполняется, когда запрос начался
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsList.rejected, (state, action) => {
        // Действие выполняется, если запрос завершился ошибкой
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredientsList.fulfilled, (state, action) => {
        // Действие выполняется, если запрос успешно завершился
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

// Экспорт селекторов для доступа к состоянию ингредиентов из компонента
export const getIngredientsState = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients;
export const getIngredientsLoadingState = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.loading;

export const getIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.ingredients; // Селектор для получения списка ингредиентов

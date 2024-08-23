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

// Начальное состояние
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
    builder
      .addCase(getIngredientsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredientsList.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  }
});

// Экспорт селекторов
export const getIngredientsState = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients;
export const getIngredientsLoadingState = (state: {
  ingredients: TIngredientsState;
}) => state.ingredients.loading;
export const getIngredients = (state: { ingredients: TIngredientsState }) =>
  state.ingredients.ingredients;

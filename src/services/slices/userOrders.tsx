import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../../utils/burger-api';

// Асинхронное действие для получения заказов пользователя
export const getUserOrders = createAsyncThunk('orders/ofUser', getOrdersApi);

// Определение интерфейса состояния
export interface TOrdersState {
  orders: Array<TOrder>;
  isLoading: boolean;
}

// Начальное состояние
export const initialState: TOrdersState = {
  orders: [],
  isLoading: true
};

// Создание слайса
export const userOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

// Экспорт селектора
export const listOfOrders = (state: { orders: TOrdersState }) =>
  state.orders.orders;

export default userOrdersSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../../utils/burger-api';

// Асинхронное действие для размещения нового заказа
export const placeNewOrder = createAsyncThunk(
  'order/createOrder',
  orderBurgerApi
);

export interface TNewOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | undefined;
}

// Начальное состояние
export const initialState: TNewOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: undefined
};

export const newOrderSlice = createSlice({
  name: 'newOrder',
  initialState,
  reducers: {
    resetOrder: () => initialState // Сброс состояния к начальному
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order; // Данные успешного заказа
        state.error = undefined;
      })
      .addCase(placeNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Неизвестная ошибка'; // Ошибка при заказе
      })
      .addCase(placeNewOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = undefined; // Ожидание выполнения заказа
      });
  }
});

// Экспорт селекторов
export const getOrderRequest = (state: { newOrder: TNewOrderState }) =>
  state.newOrder.orderRequest;
export const getOrderModalData = (state: { newOrder: TNewOrderState }) =>
  state.newOrder.orderModalData;

// Экспорт действий
export const { resetOrder } = newOrderSlice.actions;

export default newOrderSlice.reducer;

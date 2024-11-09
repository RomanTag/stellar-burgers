import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

type Status = 'pending' | 'done' | 'created';

const statusText: Record<Status, string> = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const statusColors: Record<Status, string> = {
  pending: '#E52B1A',
  done: '#00CCCC',
  created: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const typedStatus = status as Status;
  const textStyle = statusColors[typedStatus] || '#F2F2F3';
  const text = statusText[typedStatus] || 'Неизвестный статус';

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};

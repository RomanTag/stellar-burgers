import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/Ingredients';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const [orderData, setOrderData] = useState<TOrder>({
    _id: '',
    createdAt: '',
    ingredients: [],
    status: '',
    name: '',
    updatedAt: '',
    number: 0
  });

  const { number } = useParams();
  const id = Number(number);
  const ingredients: TIngredient[] = useSelector(getIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, itemId) => {
        if (!acc[itemId]) {
          const ingredient = ingredients.find((ing) => ing._id === itemId);
          if (ingredient) {
            acc[itemId] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[itemId].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  useEffect(() => {
    if (id) {
      getOrderByNumberApi(id).then((data) => {
        setOrderData(data.orders[0]);
      });
    }
  }, [id]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

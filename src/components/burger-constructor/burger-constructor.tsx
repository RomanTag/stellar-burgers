import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearAll,
  constructorSelector
} from '../../services/slices/constructor';
import { useDispatch, useSelector } from '../../services/store';
import {
  placeNewOrder,
  getOrderModalData,
  getOrderRequest,
  resetOrder
} from '../../services/slices/newOrder';
import { isAuthCheckedSelector } from '../../services/slices/user';
import { useNavigate } from 'react-router-dom';

// Компонент конструктора бургера
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(constructorSelector.selectItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuth = useSelector(isAuthCheckedSelector);

  // Обработка клика на кнопку заказа
  const onOrderClick = () => {
    if (!isAuth) {
      return navigate('/login');
    }
    if (!constructorItems.bun || orderRequest) return;

    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id)
    ];

    dispatch(placeNewOrder(orderData));
  };

  // Закрытие модального окна заказа
  const closeOrderModal = () => {
    dispatch(resetOrder());
    dispatch(clearAll());
    navigate('/');
  };

  // Расчет общей стоимости заказа
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (total: number, item: TConstructorIngredient) => total + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

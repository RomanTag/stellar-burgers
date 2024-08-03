import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useSelector, useDispatch } from '../../services/store';
import {
  constructorSelector,
  deleteItem,
  updateAll
} from '../../services/slices/constructor';
import { TConstructorIngredient } from '@utils-types';

// Компонент элемента конструктора бургера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const constructorItems = useSelector(constructorSelector.selectItems);

    // Функция для перемещения элемента внутри массива
    function swapElements(
      state: TConstructorIngredient[],
      index: number,
      step: number
    ) {
      const copy = [...state];
      // Меняем местами элементы
      copy[index] = copy.splice(index + step, 1, copy[index])[0];
      return copy;
    }

    // Обработчик для перемещения элемента вниз
    const handleMoveDown = () => {
      dispatch(updateAll(swapElements(constructorItems.ingredients, index, 1)));
    };

    // Обработчик для перемещения элемента вверх
    const handleMoveUp = () => {
      dispatch(
        updateAll(swapElements(constructorItems.ingredients, index, -1))
      );
    };

    // Обработчик для удаления элемента
    const handleClose = () => {
      dispatch(deleteItem(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

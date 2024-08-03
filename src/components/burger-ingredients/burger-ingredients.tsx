import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import {
  getIngredientsList,
  getIngredientsState
} from '../../services/slices/Ingredients';
import { Preloader } from '../ui/preloader';

export const BurgerIngredients: FC = () => {
  // Извлекаем состояние ингредиентов из хранилища
  const { ingredients, loading, error } = useSelector(getIngredientsState);

  // Фильтруем ингредиенты по типам
  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  // Состояние текущей вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Ссылки на заголовки секций
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Хуки для отслеживания видимости секций
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Обновляем текущую вкладку при изменении видимости секций
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по вкладке
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    switch (tab) {
      case 'bun':
        titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'main':
        titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'sauce':
        titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  // Обработка ошибок загрузки
  if (error) {
    console.error('Error loading ingredients:', error);
    return <p>Упс... что-то пошло не так...</p>;
  }

  // Показ прелоадера при загрузке
  if (loading) {
    console.log('Loading ingredients...');
    return <Preloader />;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};

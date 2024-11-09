import {
  constructorSlice,
  addItem,
  deleteItem,
  clearAll,
  updateAll,
  initialState,
  TConstructorState,
  swapIngredient,
  constructorSelector
} from '../slices/constructor';
import {
  allIngredientsWithDeletedIngredient,
  singleBunIngredientWId,
  singleBunIngredientWOId,
  singleNonBunIngredientWId,
  singleNonBunIngredientWOId,
  allNonBunIngredientsWId,
  orderedIngredientsWId,
  orderedIngredientsWOId,
  allNonBunIngredientsWOIdSwap1to2,
  allNonBunIngredientsWOIdSwap1to0
} from '../testData';

import { TConstructorIngredient, TIngredient } from '@utils-types';

// Утилита для удаления поля id из объекта ингредиента
function deleteId(obj: TConstructorIngredient) {
  return (({ id, ...params }) => params)(obj);
}

// Утилита для удаления поля id из массива ингредиентов
function deleteIdFromTheArray(array: TConstructorIngredient[]) {
  const ingredientsWithoutId: TIngredient[] = [];
  array.forEach((ingredient) => {
    ingredientsWithoutId.push(deleteId(ingredient));
  });
  return ingredientsWithoutId;
}

describe('тесты constructorSlice', () => {
  // Тест на добавление обычного ингредиента (не булки)
  test('добавить ингредиент (не булка)', () => {
    const newState = constructorSlice.reducer(
      initialState,
      addItem(singleNonBunIngredientWId)
    );

    const { ingredients, bun } = newState;
    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(null).toEqual(bun); // Проверяем, что булка не добавлена
    expect([singleNonBunIngredientWOId]).toEqual(ingredientsWithoutId); // Проверяем, что ингредиент добавлен
  });

  // Тест на добавление булки
  test('добавить ингредиент (булка)', () => {
    const newState = constructorSlice.reducer(
      initialState,
      addItem(singleBunIngredientWId)
    );

    const { ingredients, bun } = newState;
    let bunWithoutId = null;
    if (bun?.id) {
      bunWithoutId = deleteId(bun);
    }

    expect(singleBunIngredientWOId).toEqual(bunWithoutId); // Проверяем, что булка добавлена
    expect(ingredients).toEqual([]); // Проверяем, что больше никаких ингредиентов не добавлено
  });

  // Тест на удаление ингредиента
  test('удалить ингредиент', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: null,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      deleteItem(singleNonBunIngredientWId)
    );

    const { ingredients } = newState;
    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(allIngredientsWithDeletedIngredient).toEqual(ingredientsWithoutId); // Проверяем, что ингредиент удален
  });

  // Тест на очистку всех ингредиентов
  test('очистить ингредиенты', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      clearAll()
    );

    const { ingredients, bun } = newState;

    expect(ingredients).toEqual([]); // Проверяем, что все ингредиенты очищены
    expect(bun).toEqual(null); // Проверяем, что булка очищена
  });

  // Тест на обновление списка ингредиентов
  test('обновить список ингредиентов', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      updateAll(orderedIngredientsWId)
    );

    const { ingredients } = newState;
    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(ingredientsWithoutId).toEqual(orderedIngredientsWOId); // Проверяем, что список ингредиентов обновлен
  });

  // Тест на перемещение ингредиента вниз по списку
  test('переместить ингредиент вниз', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      swapIngredient({ index: 1, step: 1 })
    );

    const { ingredients } = newState;
    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(ingredientsWithoutId).toEqual(allNonBunIngredientsWOIdSwap1to2); // Проверяем, что ингредиент переместился вниз
  });

  // Тест на перемещение ингредиента вверх по списку
  test('переместить ингредиент вверх', () => {
    const initialStateFromConstants: TConstructorState = {
      bun: singleBunIngredientWId,
      ingredients: allNonBunIngredientsWId
    };
    const newState = constructorSlice.reducer(
      initialStateFromConstants,
      swapIngredient({ index: 1, step: -1 })
    );

    const { ingredients } = newState;
    const ingredientsWithoutId = deleteIdFromTheArray(ingredients);

    expect(ingredientsWithoutId).toEqual(allNonBunIngredientsWOIdSwap1to0); // Проверяем, что ингредиент переместился вверх
  });

  // Тест на работу селектора constructorSelector
  test('селектор selectItems возвращает состояние', () => {
    const newState = {
      constructorIngredient: {
        bun: singleBunIngredientWId,
        ingredients: allNonBunIngredientsWId
      }
    };
    const receivedState = constructorSelector.selectItems(newState);
    expect(receivedState).toEqual(newState.constructorIngredient); // Проверяем, что селектор возвращает правильное состояние
  });
});

import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

// Получаем корневой элемент для модальных окон
const modalRoot = document.getElementById('modals') as HTMLDivElement;

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  // Эффект для добавления и удаления слушателя нажатия клавиши Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(); // Закрыть модальное окно при нажатии Escape
      }
    };

    document.addEventListener('keydown', handleEsc);

    // Очистка слушателя при размонтировании компонента
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Используем createPortal для рендеринга модального окна в root элемент
  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot
  );
});

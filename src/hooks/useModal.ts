import { store } from '@app/src/store';
import { useDispatch } from 'react-redux';
import { modalActions } from '../store/slices/modalSlice';

/**
 * ModalPlacer에서 사용할 모달을 열고 닫는 함수를 반환함.
 * 추후 react-redux를 다른 것으로 대체할 경우 고려해야 함.
 * 자세한 modal의 작동방식은 modalSlice.ts를 참고.
 *
 * @author OH_jimin
 * @returns modal을 조작하는 함수를 담은 객체
 */
export function useModal() {
  const dispatch = useDispatch();

  const open = (ui: JSX.Element) => {
    const key = Math.floor(Math.random() * 1000000);
    dispatch(modalActions.open({ ui, key }));
    return key;
  };

  const close = (key: number) => {
    dispatch(modalActions.close(key));
  };

  const closeAll = () => {
    dispatch(modalActions.closeAll());
  };

  return { open, close, closeAll };
}

/**
 * ModalPlacer에서 사용할 모달을 열고 닫는 함수를 반환함.
 * class형 컴포넌트를 지원하기 위해 react-redux의 useDispatch를 사용하지 않고, 직접 store에 접근함.
 * 추후 react-redux를 다른 것으로 대체할 경우 고려해야 함.
 * 자세한 modal의 작동방식은 modalSlice.ts를 참고.
 * 함수형 컴포넌트에서는 useModal을 사용하고, class형에서는 getModalController를 사용하면 됨.
 *
 * @author OH_jimin
 * @returns modal을 조작하는 함수를 담은 객체
 */
export function getModalController() {
  const open = (ui: JSX.Element) => {
    const key = Math.floor(Math.random() * 1000000);
    store.dispatch(modalActions.open({ ui, key }));
    return key;
  };

  const close = (key: number) => {
    store.dispatch(modalActions.close(key));
  };

  const closeAll = () => {
    store.dispatch(modalActions.closeAll());
  };

  return { open, close, closeAll };
}

import { useEffect } from 'react';
import { isCtrlOrCmd } from '../utils';

/**
 * 키보드 이벤트를 등록하는 함수
 *
 * 1. 리엑트 컴포넌트가 마운트되면 자동으로 키보드 이벤트를 등록한다.
 * 2. 디펜던시 어레이에 있는 값중 하나의 레퍼런스가 변경되면 자동으로 키보드 이벤트를 업데이트한다.
 * 3. 리엑트 컴포넌트의 마운트가 해제되면 자동으로 키보드 이벤트를 제거한다.
 *
 * @author 오지민 2023.02.24
 * @example
 * useKeyDownEvent('ctrl+Equal', () => zoom(0.1));
 * useKeyDownEvent('ctrl+alt+Equal', () => zoom(0.01));
 * useKeyDownEvent('ctrl+shift+Equal', () => zoom(0.5));
 * useKeyDownEvent('ctrl+Minus', () => zoom(0.1));
 * useKeyDownEvent('ctrl+alt+Minus', () => zoom(0.01));
 * useKeyDownEvent('ctrl+shift+Minus', () => zoom(0.5));
 *
 * @param shortcut 지정할 단축키
 * @param listener 단축키가 입력되었을 때 실행할 함수
 * @param dependencies 리액트 디펜던시 배열
 */
export function useKeyDownEvent(
  shortcut: string,
  listener: (this: Window, ev: KeyboardEvent) => any,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    const keys = shortcut.split('+').map((key) => key.trim());
    const onKeyDown = (e: KeyboardEvent) => {
      if (keys.includes('ctrl') && !isCtrlOrCmd(e)) return;
      if (keys.includes('alt') && !e.altKey) return;
      if (keys.includes('shift') && !e.shiftKey) return;
      if (e.code !== keys.at(-1)) return;
      listener.call(window, e);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, dependencies);
}

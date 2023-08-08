import { cloneDeep } from '../utils';
import { useReducer, useState } from 'react';

export type Reducer<S = any, P = any> = (state: S, payload: P) => S | void;
export type Reducers<S = any> = { [K: string]: Reducer<S> };
export type Dispatcher<R extends Reducer> = (payload: Parameters<R>[1]) => void;
export type Dispatchers<RS extends Reducers> = { [Type in keyof RS]: Dispatcher<RS[Type]> };

/**
 * useReducer의 type-safe 버전
 *
 * @param initialState state의 최초값
 * @param reducers redux-toolkit의 createSlice reducers스타일의 객체
 * 1. reducer에서 undefined를 반환할 경우, mutable스타일의 reducer지원 (immerjs처럼 사용가능)
 * 2. reducer에서 undefined가 아닌 값을 반환할 경우, immutable스타일의 reducer지원
 *
 * @returns [state, state를 변경하는 액션들의 객체]
 * @example
 * const [data, dataActions] = useTypeSafeReducer(widgetDataSet.data, {
 *   addImage: (state, payload: WidgetDataSetDataImage) => {
 *     state.push({ zOrder: state.length, item: [payload] });
 *   },
 *   updateImage: (state, payload: { index: number; value: WidgetDataSetDataImage }) => {
 *     state[payload.index].item[0] = payload.value;
 *   },
 *   removeImage: (state, payload: number) => {
 *     state.splice(payload, 1);
 *     state.forEach((datum, index) => (datum.zOrder = index));
 *   },
 * });
 */
export function useTypeSafeReducer<S, RS extends Reducers<S>>(
  initialState: S | (() => S),
  reducers: RS,
  cloneFn: (state: S) => S = cloneDeep
) {
  const [state, setState] = useState(initialState);

  const dispatch = (action: { type: string; payload: any }) => {
    setState((prev) => {
      const reducer = reducers[action.type];
      const newState = cloneFn(prev);
      const reducedState = reducer(newState, action.payload);
      return reducedState === undefined ? newState : (reducedState as S);
    });
  };

  /**
   * useReducer를 사용하는 버전
   */
  // const [state, dispatch] = useReducer(
  //   (state: S, action: { type: string; payload: any }) => {
  //     const reducer = reducers[action.type];
  //     const newState = cloneDeep(state);
  //     const reducedState = reducer(newState, action.payload);
  //     return reducedState === undefined ? newState : (reducedState as S);
  //   },
  //   initialState
  // );

  const actions = Object.keys(reducers).reduce((acc, type) => {
    acc[type] = (payload: any) => dispatch({ type, payload });
    return acc;
  }, {}) as Dispatchers<RS>;

  return [state, actions] as const;
}

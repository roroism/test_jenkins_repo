import React, { createContext, useCallback, useEffect, useState } from 'react';

export function createStore<T extends { [key: string]: any }>(initialState: T) {
  let state = initialState;
  const subscribers = new Set<() => void>();

  const Context = createContext<T>(state);

  const subscribe = <SelectFn extends (state: T) => any>(selector: SelectFn) => {
    const [selected, setSelected] = useState<ReturnType<SelectFn>>();

    const subscriber = useCallback(() => {
      const newSelected = selector(state);
      if (selected === newSelected) return;
      setSelected(newSelected);
    }, []);

    useEffect(() => {
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    }, []);

    return selected;
  };

  const publish = (partialState: Partial<T>) => {
    state = { ...state, ...partialState };
    subscribers.forEach((subscriber) => subscriber());
  };

  const Provider = (props: { children: React.ReactNode }) => {
    return React.createElement(Context.Provider, { value: state }, props.children);
  };

  return { Provider, subscribe, publish };
}

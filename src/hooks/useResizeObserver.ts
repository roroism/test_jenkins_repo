import { RefCallback, useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '../utils';

type Dimention = {
  width: number;
  height: number;
};

export function useResizeObserver(defaultDimensions: Dimention, debounceDelay = 0) {
  const [dimension, setDimension] = useState(defaultDimensions);

  const observerRef = useRef(
    new ResizeObserver(
      debounce((entries) => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        setDimension({ width, height });
      }, debounceDelay)
    )
  );

  const ref: RefCallback<Element> = useCallback((node) => {
    observerRef.current.observe(node);
  }, []);

  useEffect(() => {
    return () => observerRef.current.disconnect();
  }, []);

  return [ref, dimension];
}

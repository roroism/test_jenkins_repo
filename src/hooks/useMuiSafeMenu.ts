import { useEffect, useRef, useState } from 'react';

export function useMuiSafeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);
  const anchorEl = btnRef.current;

  const triggerProps = {
    ref: btnRef,
    onClick: toggle,
  };

  const popperProps = {
    anchorEl: anchorEl,
    open: isOpen,
    onClick: close,
  };

  return { isOpen, open, anchorEl, close, btnRef, triggerProps, popperProps };
}

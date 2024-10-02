import { useState, useEffect, useCallback } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResizeWindow = useCallback(
    () => setSize((prev) => {
      const next = { ...prev };
      if (prev.width !== window.innerWidth) next.width = window.innerWidth;
      if (prev.height !== window.innerHeight) next.height = window.innerHeight;
      return next;
    }),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    }
  }, [handleResizeWindow]);

  return size;
};

export default useWindowSize;

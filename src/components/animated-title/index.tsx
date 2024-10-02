import { useState, useCallback, useEffect, useMemo } from 'react';

import './styles.scss';

export type AnimatedTitleProps = {
  text: string;
};

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text }) => {
  const [animated, setAnimated] = useState(Array.from({ length: text.length }).fill(false));

  const characters = useMemo(() => {
    return text
      .split('')
      .map((el, idx) =>
        el.charCodeAt(0) === 32  ? ' ': (
          <span key={idx} data-idx={idx} className={`${animated[idx] ? 'active' : ''}`}>
            {el}
          </span>
        )
      );
  }, [text, animated]);

  const handleClick = useCallback(
    (e: any) => {
      const elemIdx = e.target?.getAttribute('data-idx');
      if (!elemIdx) return;
      setAnimated((prev) => {
        const next = prev.map(() => false);
        next[Number(elemIdx)] = !next[Number(elemIdx)];
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setAnimated((prev) => prev.map(() => true));
    }, 1500);
    const resetAnimatedState = setTimeout(() => {
      setAnimated((prev) => prev.map(() => false));
    }, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(resetAnimatedState);
    };
  }, []);

  return (
    <div className="animated-phrase" onClick={handleClick}>
      {characters}
    </div>
  );
};

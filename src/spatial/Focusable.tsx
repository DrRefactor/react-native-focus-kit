import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import { useFocusableLayer } from './FocusableLayer';
import { useFunction } from '../hooks/useFunction';
import { useImmutable } from '../hooks/useImmutable';

type FocusableProps = {
  // todo make this platform agnostic
  style?: CSSProperties;
  focusedStyle?: CSSProperties;
};

const Focusable: React.FC<FocusableProps> = ({
  children,
  style,
  focusedStyle
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measure = useFunction(() => containerRef.current?.getBoundingClientRect() ?? null);

  const [focused, setFocused] = useState(false);

  const focus = useFunction(() => setFocused(true));
  const blur = useFunction(() => setFocused(false));
  const canBecomeFocused = useFunction(() => true);

  const self = useImmutable(() => ({measure, focus, blur, canBecomeFocused}));
  
  const {register, unregister} = useFocusableLayer();

  useEffect(() => {
    const selfReference = self.current;
    register(selfReference);

    return () => unregister(selfReference);
  }, [measure, register, self, unregister]);

  return (
    <div style={{...style, ...focused && focusedStyle}} ref={containerRef}>
      {children}
    </div>
  )
}

// no reason to .memo() as JSX `children` break memo anyway
export default Focusable;

import React, { useEffect, useRef, useState } from 'react';
import { useFocusableLayer } from './FocusableLayer';
import { useFunction } from '../hooks/useFunction';
import { useImmutable } from '../hooks/useImmutable';
import { StyleProp, View, ViewStyle } from 'react-native';
import { measureView } from './SpatialHelpers';

type FocusableProps = {
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
};

const Focusable: React.FC<FocusableProps> = ({
  children,
  style,
  focusedStyle
}) => {
  const containerRef = useRef<View>(null);
  const measure = useFunction(() => measureView(containerRef.current));

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
    <View style={[style, focused && focusedStyle]} ref={containerRef}>
      {children}
    </View>
  )
}

// no reason to .memo() as JSX `children` break memo anyway
export default Focusable;

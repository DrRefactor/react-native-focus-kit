import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { useFocusableLayer } from './FocusableLayer';
import { useFunction } from '../hooks/useFunction';
import { useImmutable } from '../hooks/useImmutable';
import { StyleProp, View, ViewStyle } from 'react-native';
import { measureView } from './SpatialHelpers';
import { Geometry } from './SpatialTypes';

type FocusableProps = {
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onFocus?: (view?: View | null, self?: FocusableInterface) => void;
};

type FocusableInterface = {
  measure: () => Promise<Geometry | null>;
};

const Focusable = ({
  children,
  style,
  focusedStyle,
  onFocus
}: FocusableProps,
ref: React.Ref<FocusableInterface>) => {
  const containerRef = useRef<View>(null);
  const measure = useFunction(() => measureView(containerRef.current));

  const [focused, setFocused] = useState(false);

  const focus = useFunction(() => setFocused(true));
  const blur = useFunction(() => setFocused(false));
  const canBecomeFocused = useFunction(() => true);

  const publicInterface = useFunction(() => ({
    measure
  }));

  const onFocusChange = useFunction((focused: boolean) => {
    if (focused) {
      onFocus?.(containerRef.current, publicInterface());
    }
  });

  useEffect(() => {
    if (focused) {
      onFocusChange(focused);
    }
  }, [focused, onFocusChange]);

  useImperativeHandle(
    ref,
    publicInterface,
    []
  )

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
Focusable.displayName = 'Focusable';

// no reason to .memo() as JSX `children` break memo anyway
export default React.forwardRef<FocusableInterface, FocusableProps>(Focusable);

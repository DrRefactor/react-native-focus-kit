import React, { useContext, useState, useEffect } from 'react';
import { noop } from '../utils';
import { FocusableElement } from './SpatialTypes';
import { useSpatialRegistry, useFocusNavigator } from './SpatialHooks';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useFunction } from '../hooks/useFunction';

export type FocusableLayerContextType = {
  register: (element: FocusableElement) => void;
  unregister: (element: FocusableElement) => void;
};
const FocusableLayerContext = React.createContext<FocusableLayerContextType>({
  register: noop,
  unregister: noop
});
export function useFocusableLayer() {
  return useContext(FocusableLayerContext);
}

type FocusableLayerProps = {
  style?: StyleProp<ViewStyle>;
}
const FocusableLayer: React.FC<FocusableLayerProps> = ({
  children,
  style
}) => {
  const [focusedElement, setFocusedElement] = useState<FocusableElement>();

  useEffect(() => {
    focusedElement?.focus();
    return () => focusedElement?.blur();
  }, [focusedElement]);
  
  const requestFocus = useFunction((element: FocusableElement) => {
    setFocusedElement(element);
  })

  const {elements, contextValue} = useSpatialRegistry();
  useFocusNavigator({elements, requestFocus, focusedElement});

  return (
    <FocusableLayerContext.Provider value={contextValue}>
      <View style={style}>
          {children}
      </View>
    </FocusableLayerContext.Provider>
  )
}

export default FocusableLayer;

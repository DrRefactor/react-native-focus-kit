import React, { CSSProperties, useContext } from 'react';
import { noop } from '../utils';
import { FocusableElement } from './SpatialTypes';
import { useSpatialRegistry, useFocusNavigator } from './SpatialHooks';
import { useMainFocusController } from './MainFocusController';

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
  style?: CSSProperties;
}
const FocusableLayer: React.FC<FocusableLayerProps> = ({
  children,
  style
}) => {
  const {elements, contextValue} = useSpatialRegistry();
  const {focus, focusedElement} = useMainFocusController();
  useFocusNavigator({elements, requestFocus: focus, focusedElement});

  return (
    <FocusableLayerContext.Provider value={contextValue}>
      <div style={style}>
          {children}
      </div>
    </FocusableLayerContext.Provider>
  )
}

export default FocusableLayer;

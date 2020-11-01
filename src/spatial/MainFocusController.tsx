import React, { useMemo, useState, useContext } from 'react';
import { FocusableElement } from './SpatialTypes';
import { noop } from '../utils';
import { useFunction } from '../hooks/useFunction';
import { ArrowKeyEventEmitter, ArrowKeyEventEmitterContext } from '../hooks/useKeyDownListener';

type MainFocusControllerContextType = {
  focusedElement?: FocusableElement;
  focus: (element: FocusableElement) => void;
  // blur?
}

const MainFocusControllerContext = React.createContext<MainFocusControllerContextType>({
  focus: noop
});

export function useMainFocusController() {
  return useContext(MainFocusControllerContext);
}

type Props = {
  arrowKeyEventEmitter: ArrowKeyEventEmitter;
}

const MainFocusController: React.FC<Props> = ({
  children,
  arrowKeyEventEmitter
}) => {
  const [focusedElement, setFocusedElement] = useState<FocusableElement>();
  
  const focusElement = useFunction((element: FocusableElement) => {
    setFocusedElement(previous => {
      previous?.blur();
      element.focus();
      return element;
    });
  })

  const contextValue = useMemo<MainFocusControllerContextType>(() => ({
    focus: focusElement,
    focusedElement
  }), [focusElement, focusedElement]);

  return (
    <MainFocusControllerContext.Provider value={contextValue}>
      <ArrowKeyEventEmitterContext.Provider value={arrowKeyEventEmitter}>
        {children}
      </ArrowKeyEventEmitterContext.Provider>
    </MainFocusControllerContext.Provider>
  )
};

export default MainFocusController;

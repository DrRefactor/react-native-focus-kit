import React, { useMemo, useState, useContext } from 'react';
import { FocusableElement } from './SpatialTypes';
import { noop } from '../utils';
import { useFunction } from '../hooks/useFunction';

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

const MainFocusController: React.FC = ({children}) => {
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
      {children}
    </MainFocusControllerContext.Provider>
  )
};

export default MainFocusController;

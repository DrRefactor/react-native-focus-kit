import React from 'react';
import { ArrowKeyEventEmitter, ArrowKeyEventEmitterContext } from '../hooks/useKeyDownListener';

type Props = {
  arrowKeyEventEmitter: ArrowKeyEventEmitter;
}

const MainFocusController: React.FC<Props> = ({
  children,
  arrowKeyEventEmitter
}) => {
  return (
    <ArrowKeyEventEmitterContext.Provider value={arrowKeyEventEmitter}>
      {children}
    </ArrowKeyEventEmitterContext.Provider>
  )
};

export default MainFocusController;

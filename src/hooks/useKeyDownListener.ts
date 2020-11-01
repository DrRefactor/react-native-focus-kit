import { useFunction } from "./useFunction";
import { useContext, useEffect } from "react";
import React from "react";
import { logError } from "../utils";

export enum ArrowKey {
  ArrowLeft = 'ArrowLeft',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp'
}
export function isHorizontal(arrowKey: ArrowKey) {
  return [ArrowKey.ArrowLeft, ArrowKey.ArrowRight].includes(arrowKey);
}
export function isPositivelyOriented(arrowKey: ArrowKey) {
  return [ArrowKey.ArrowRight, ArrowKey.ArrowDown].includes(arrowKey);
}

const handledKeys: string[] = [
  ArrowKey.ArrowLeft,
  ArrowKey.ArrowRight,
  ArrowKey.ArrowDown,
  ArrowKey.ArrowUp
];

function isHandled(candidate: string): candidate is ArrowKey {
  return handledKeys.includes(candidate);
}

export enum ArrowKeyEvent {
  Press = 'Press'
}
type ArrowKeyListenerType = (key: ArrowKey) => void;
export type ArrowKeyEventEmitter = {
  on: (event: ArrowKeyEvent, listener: ArrowKeyListenerType) => void;
  off: (event: ArrowKeyEvent, listener: ArrowKeyListenerType) => void;
}
export const ArrowKeyEventEmitterContext = React.createContext<ArrowKeyEventEmitter | null>(null);

export function useKeyDownListener(listener: (key: ArrowKey) => void) {
  const internalListener = useFunction((key: ArrowKey) => {
    if (isHandled(key)) {
      listener(key);
    } else {
      logError(`Unknown key event ${key}`);
    }
  });

  const emitter = useContext(ArrowKeyEventEmitterContext);

  useEffect(() => {
    emitter?.on(ArrowKeyEvent.Press, internalListener);
    if (!emitter) {
      logError(`Arrow key event emitter is undefined. 'arrowKeyEventEmitter' prop must be passed to MainFocusController.`);
    }

    return () => emitter?.off(ArrowKeyEvent.Press, internalListener);
  }, [internalListener, emitter])
}

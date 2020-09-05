import { useFunction } from "./useFunction";
import { useEffect } from "react";

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

export function useKeyDownListener(listener: (key: ArrowKey) => void) {
  const internalListener = useFunction((event: KeyboardEvent) => {
    if (isHandled(event.key)) {
      listener(event.key);
    }
  })

  useEffect(() => {
    document.addEventListener('keydown', internalListener);

    return () => document.removeEventListener('keydown', internalListener);
  }, [internalListener])
}

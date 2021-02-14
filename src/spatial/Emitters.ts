import { ArrowKeyEventEmitter, ArrowKeyEvent, ArrowKey } from "../hooks/useKeyDownListener";
import { useEmitter } from "../hooks/useEmitter";
import { useMemo, useEffect } from "react";

type EmitterPayload = {
  [ArrowKeyEvent.Press]: ArrowKey;
};
enum WebKeyCode {
  Left = 37,
  Up = 38,
  Right = 39,
  Down = 40 
}
const keyCodeToArrow = {
  [WebKeyCode.Left]: ArrowKey.ArrowLeft,
  [WebKeyCode.Up]: ArrowKey.ArrowUp,
  [WebKeyCode.Right]: ArrowKey.ArrowRight,
  [WebKeyCode.Down]: ArrowKey.ArrowDown
}

export function useWebArrowsEmitter(): ArrowKeyEventEmitter {
  const emitter = useEmitter<ArrowKeyEvent.Press, EmitterPayload>();

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      const arrow = keyCodeToArrow[event.keyCode as WebKeyCode];
      if (arrow != null) {
        emitter.emit(ArrowKeyEvent.Press, arrow);
      }
    })
  }, [emitter]);

  // TODO implement emitters for atv, tvOS
  return useMemo(
    () => ({
      on: emitter.on,
      off: emitter.off,
    }),
    [emitter.off, emitter.on],
  );
}

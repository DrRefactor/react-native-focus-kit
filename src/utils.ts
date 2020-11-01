import { ArrowKeyEventEmitter } from "./hooks/useKeyDownListener";

export function noop() {}

export function range(length: number) {
  return (new Array(length)).fill(null).map((_, i) => i);
}

export function logError(message: string) {
  console.error(`(react-native-focus-kit) ${message}`);
}

export function webArrowsEventEmitter(): ArrowKeyEventEmitter {
  // STUB
  // TODO implement emitters for web, atv, tvOS
  return {
    on: () => {},
    off: () => {}
  }
}

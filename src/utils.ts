export function noop() {}

export function range(length: number) {
  return (new Array(length)).fill(null).map((_, i) => i);
}

export function logError(message: string) {
  console.error(`(react-native-focus-kit) ${message}`);
}

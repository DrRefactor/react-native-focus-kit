import { useRef } from "react";

type ImmutableRef<T> = {
  readonly current: T;
}

export function useImmutable<T>(initializer: () => T): ImmutableRef<T> {
  const initialized = useRef(false);
  const ref = useRef<T>();
  if (!initialized.current) {
    ref.current = Object.freeze(initializer());
    initialized.current = true;
  }

  return ref as ImmutableRef<T>;
}

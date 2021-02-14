import {useRef} from 'react';
import {useFunction} from './useFunction';

export function useEmitter<
  EventName extends string,
  EventPayload extends {[name in EventName]: any}
>() {
  type Payload = EventPayload[EventName];
  type Callback = (payload: Payload) => void;
  type Callbacks = Record<EventName, Set<Callback>>;

  const callbacks = useRef<Callbacks>({} as Callbacks);

  const on = useFunction(
    <T extends EventName>(
      eventName: T,
      listener: (payload: EventPayload[T]) => void,
    ) => {
      if (!(eventName in callbacks.current)) {
        callbacks.current[eventName] = new Set();
      }
      callbacks.current[eventName].add(listener as (payload: Payload) => void);
    },
  );
  const off = useFunction((eventName: EventName, listener: Callback) => {
    callbacks.current[eventName]?.delete(listener);
  });

  const emit = useFunction(
    <T extends EventName>(eventName: T, payload: EventPayload[T]) => {
      callbacks.current[eventName]?.forEach((callback) => callback(payload));
    },
  );

  return {on, off, emit};
}

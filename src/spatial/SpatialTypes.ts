export type FocusableElement = {
  measure: () => DOMRect | null;
  focus: () => void;
  blur: () => void;
  canBecomeFocused: () => boolean;
  // id?
}

export type FocusableElementWithGeometry = {
  geometry: DOMRect | null;
  element: FocusableElement;
}

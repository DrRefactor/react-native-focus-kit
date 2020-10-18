export type Geometry = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type FocusableElement = {
  measure: () => Promise<Geometry | null>;
  focus: () => void;
  blur: () => void;
  canBecomeFocused: () => boolean;
  // id?
}

export type FocusableElementWithGeometry = {
  geometry: Geometry | null;
  element: FocusableElement;
}

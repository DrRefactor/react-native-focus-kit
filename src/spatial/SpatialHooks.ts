import { useRef, useCallback, useState, useMemo } from "react";
import { FocusableElement, FocusableElementWithGeometry } from "./SpatialTypes";
import { useKeyDownListener, ArrowKey, isHorizontal, isPositivelyOriented } from "../hooks/useKeyDownListener";
import { FocusableLayerContextType } from "./FocusableLayer";
import { View } from "react-native";
import { measureView } from "./SpatialHelpers";

export function useMeasure() {
  const ref = useRef<View>();

  const measure = useCallback(() => measureView(ref.current), []);

  return {ref, measure}
}

// very loose filter, consider some diagonal filtering
// e.g. flat x or y tolerance + 45deg diagonal filter
const isReachable = (focusedElement: FocusableElementWithGeometry, key: ArrowKey) => (candidate: FocusableElementWithGeometry) => {
  const focusedFactor = isHorizontal(key)
    ? focusedElement.geometry?.x
    : focusedElement.geometry?.y;

  const candidateFactor = isHorizontal(key)
    ? candidate.geometry?.x
    : candidate.geometry?.y;

  if (focusedFactor == null || candidateFactor == null) {
    return false;
  }

  return isPositivelyOriented(key)
    ? candidateFactor > focusedFactor
    : candidateFactor < focusedFactor;
}

function collides(lhs: [number, number], rhs: [number, number]) {
  const [beginsFirst, beginsSecond] = lhs[0] < rhs[0]
    ? [lhs, rhs]
    : [rhs, lhs];
  
  // `true` implicates either containing whole `beginsSecond` in `beginsFirst`
  //// or collision if first edge of `beginsSecond` is contained between edges of `beginsFirst` 
  return beginsFirst[1] >= beginsSecond[0];
}

const collidesWithDirectionalExtension = (focusedElement: FocusableElementWithGeometry, key: ArrowKey) => (candidate: FocusableElementWithGeometry) => {
  if (!candidate.geometry || !focusedElement.geometry) {
    return false;
  }

  return isHorizontal(key)
    ? collides([candidate.geometry.top, candidate.geometry.bottom], [focusedElement.geometry.top, focusedElement.geometry.bottom])
    : collides([candidate.geometry.left, candidate.geometry.right], [focusedElement.geometry.left, focusedElement.geometry.right]);
}

const calculateDistance = (focusedElement: FocusableElementWithGeometry, key: ArrowKey) => (candidate: FocusableElementWithGeometry) => {
  if (!focusedElement.geometry || !candidate.geometry) {
    return Infinity;
  }
  
  const delta = isHorizontal(key)
    ? candidate.geometry.left - focusedElement.geometry.left
    : candidate.geometry.top - focusedElement.geometry.top;

  return Math.abs(delta);
}

const calculateDistanceToDirectionalExtension = (focusedElement: FocusableElementWithGeometry, key: ArrowKey) => (candidate: FocusableElementWithGeometry) => {
  if (!focusedElement.geometry || !candidate.geometry) {
    return Infinity;
  }

  const orthogonalRange = (element: FocusableElementWithGeometry): [number, number] => isHorizontal(key)
    ? [element.geometry!.top, element.geometry!.bottom]
    : [element.geometry!.left, element.geometry!.right];
  
  const focusedOrthogonalRange = orthogonalRange(focusedElement);
  const candidateOrthogonalRange = orthogonalRange(candidate);

  if (collides(candidateOrthogonalRange, focusedOrthogonalRange)) {
    return 0;
  }

  const [beginsFirst, beginsSecond] = candidateOrthogonalRange[0] < focusedOrthogonalRange[0]
    ? [candidateOrthogonalRange, focusedOrthogonalRange]
    : [focusedOrthogonalRange, candidateOrthogonalRange];

  const delta = beginsFirst[1] - beginsSecond[0];
  return Math.abs(delta);
}

async function findClosest(elements: FocusableElement[], focusedElement: FocusableElement, key: ArrowKey): Promise<FocusableElement | undefined> {
  const focusedElementWithGeometry = {
    element: focusedElement,
    geometry: await focusedElement.measure()
  };

  const elementsWithGeometry = await Promise.all(
    elements
      .map(async element => ({element, geometry: await element.measure()}))
  )

  return elementsWithGeometry
    .filter(({geometry}) => geometry != null)
    .filter(isReachable(focusedElementWithGeometry, key))
    .reduce((closest, candidate) => {
      if (!closest) {
        return candidate;
      }

      const checkDirectionalExtensionCollision = collidesWithDirectionalExtension(focusedElementWithGeometry, key)
      const candidateInDirectionalExtension = checkDirectionalExtensionCollision(candidate);
      const closestInDirectionalExtension = checkDirectionalExtensionCollision(closest);

      if (closestInDirectionalExtension && !candidateInDirectionalExtension) {
        return closest;
      }
      if (candidateInDirectionalExtension && !closestInDirectionalExtension) {
        return candidate;
      }

      const distanceFromFocused = calculateDistance(focusedElementWithGeometry, key);

      if (closestInDirectionalExtension && candidateInDirectionalExtension) {
        return distanceFromFocused(candidate) < distanceFromFocused(closest)
          ? candidate
          : closest;
      }

      // neither in directional extension
      const distanceFromDirectionalExtension = calculateDistanceToDirectionalExtension(focusedElementWithGeometry, key);

      // "closest"<->focused geometry info could be cached in accumulator
      return distanceFromDirectionalExtension(candidate) < distanceFromDirectionalExtension(closest)
        ? candidate
        : closest;
    }, undefined as FocusableElementWithGeometry | undefined)
    ?.element;
}

export function useFocusNavigator({
  elements,
  focusedElement,
  requestFocus
}: {
  elements: FocusableElement[];
  focusedElement?: FocusableElement;
  requestFocus: (element: FocusableElement) => void;
}) {
  useKeyDownListener(async key => {
    if (focusedElement == null) {
      // todo
      // this is bad initial focus calculation, implement some reasonable strategy
      if (elements[0]) {
        requestFocus(elements[0]);
      }
      return;
    }

    const closest = await findClosest(elements, focusedElement, key);
    if (closest) {
      requestFocus(closest);
    }
  })
}

export function useSpatialRegistry() {
  const [elements, setElements] = useState<FocusableElement[]>([]);

  const register = useCallback((element: FocusableElement) => {
    setElements(elements => [...elements, element]);
  }, []);
  const unregister = useCallback((element: FocusableElement) => {
    setElements(elements => {
      const filtered = elements.filter(e => e !== element);
      if (filtered.length === elements.length) {
        throw new Error('Attempted unregistering non registered element');
      }
      return filtered;
    })
  }, []);

  const contextValue: FocusableLayerContextType = useMemo(() => ({register, unregister}), [register, unregister]);

  return {elements, contextValue};
}

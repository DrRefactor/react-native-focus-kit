import { View } from "react-native";
import { Geometry } from "./SpatialTypes";

export function measureView(view?: View | null): Promise<Geometry | null> {
  if (!view) {
    return Promise.resolve(null);
  }
  return new Promise(
    resolve => view.measure(
      (
        // These do not work for Android, use pageX/pageY then.
        _x: number,
        _y: number,

        width: number,
        height: number,
        x: number,
        y: number
      ) => {
        resolve({
          x,
          y,
          width,
          height,
          top: y,
          left: x,
          bottom: y + height,
          right: x + width
        })
      }
    )
  )
}
import { View } from "react-native";
import { Geometry } from "./SpatialTypes";

export function measureView(view?: View | null): Promise<Geometry | null> {
  if (!view) {
    return Promise.resolve(null);
  }
  return new Promise(
    resolve => view.measure(
      (
        x: number,
        y: number,
        width: number,
        height: number
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
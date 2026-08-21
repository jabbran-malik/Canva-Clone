import * as fabric from "fabric";
import material from "material-colors";

export const colors = [
  material.red["500"],
  material.pink["500"],
  material.purple["500"],
  material.deepPurple["500"],
  material.indigo["500"],
  material.blue["500"],
  material.lightBlue["500"],
  material.cyan["500"],
  material.teal["500"],
  material.green["500"],
  material.lightGreen["500"],
  material.lime["500"],
  material.yellow["500"],
  material.amber["500"],
  material.orange["500"],
  material.deepOrange["500"],
  material.brown["500"],
  material.blueGrey["500"],
  "transparent",
];

export type ActiveTool =
  | "select"
  | "shapes"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-width"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates"
  | "text";

export type BuildEditorProps = {
  canvas: fabric.Canvas;
  fillColor: string;
  setFillColor: (value: string) => void;
  setStrokeColor: (value: string) => void;
  strokeColor: string;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  selectedObjects:fabric.Object[]
};

export interface Editor {
  changeFillColor: (value: string) => void;
  changeStrokeWidth: (value: number) => void;
  changeStrokeColor: (value: string) => void;
  addCircle: () => void;
  addSoftRectangle: () => void;
  addRectangle: () => void;
  addTriangle: () => void;
  addInverseTriangle: () => void;
  addDiamond: () => void;
  canvas: fabric.Canvas;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  selectedObjects: fabric.Object[]
}

export const Fill_COl = "rgba(0,0,0,1)";
export const Stroke_COl = "rgba(0,0,0,1)";
export const stroke_WIDTH = 2;

export const Circle_Options = {
  height: 100,
  radius: 225,
  left: 100,
  top: 100,
  fill: Fill_COl,
  stroke: Stroke_COl,
  strokeWIDTH: stroke_WIDTH,
};
export const Rectangle_Options = {
  height: 400,
  width: 400,
  angle: 0,
  left: 100,
  top: 100,
  fill: Fill_COl,
  stroke: Stroke_COl,
  strokeWIDTH: stroke_WIDTH,
};
export const Diamond_Options = {
  height: 600,
  width: 600,
  angle: 0,
  left: 100,
  top: 100,
  fill: Fill_COl,
  stroke: Stroke_COl,
  strokeWIDTH: stroke_WIDTH,
};
export const TrianGle_Options = {
  height: 400,
  width: 400,
  angle: 0,
  left: 100,
  top: 100,
  fill: Fill_COl,
  stroke: Stroke_COl,
  strokeWIDTH: stroke_WIDTH,
};

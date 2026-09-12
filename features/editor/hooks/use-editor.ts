import { Canvas, FabricObject, Rect, Shadow } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import * as fabric from "fabric";
import {
  BuildEditorProps,
  Circle_Options,
  Diamond_Options,
  Editor,
  EditorHookProps,
  Fill_COl,
  Rectangle_Options,
  Stroke_COl,
  stroke_Dashed_Array,
  stroke_WIDTH,
  Text_OPTIONS,
  TrianGle_Options,
} from "../types";
import { useCanvasEvents } from "@/features/editor/hooks/use-canva-events";
import { isTextType } from "@/features/editor/utilis";

type WorkspaceObject = fabric.FabricObject & { name?: string };

const buildEditor = ({
  canvas,
  fillColor,
  setFillColor,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  selectedObjects,
  strokeDashedArray,
  setStrokeDashedArray,
}: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas
      .getObjects()
      .find((object) => (object as WorkspaceObject).name === "clip");
  };
  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();

    const center = workspace?.getCenterPoint();
    if (!center) return;
    canvas._centerObject(object, center);
  };
  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };

  return {
    addText: (value, options = {})=>{
      const object = new fabric.Textbox(value, {
      ...Text_OPTIONS,
      ...options,
   fill:fillColor,
    })
    addToCanvas(object)

    },






    getActiveOpacity:()=>{
const selectedObject=selectedObjects[0]
if(!selectedObject){
  return 1
  
}
const value=selectedObject.get("opacity")||1;
return value
    },



    changeOpacity :(value:number)=>{
      canvas.getActiveObjects().forEach((Object)=>{
        Object.set({opacity:value});
      })
      canvas.renderAll()
    },


    bringforward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringObjectForward(object);
      });
      canvas.renderAll();
      const workspace = getWorkspace();

      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendObjectBackwards(object);
      });
      canvas.renderAll();

      const workspace = getWorkspace();

      if (workspace) {
        canvas.sendObjectToBack(workspace);
      }
    },

    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          object.set({ fill: value });
          return;
        }
        object.set({ stroke: value });
      });
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.renderAll();
    },
    changeStrokeDashedArray: (value: number[]) => {
      setStrokeDashedArray(value);

      canvas.getActiveObjects().forEach((object) => {
        object.set({
          strokeDashArray: value,
        });
      });

      canvas.renderAll();
    },
    addCircle: () => {
      const object = new fabric.Circle({
        ...Circle_Options,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashedArray,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...Rectangle_Options,
        rx: 10,
        ry: 10,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashedArray,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...Rectangle_Options,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashedArray,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TrianGle_Options,
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        strokeDashArray: strokeDashedArray,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = 400;
      const WIDTH = 400;
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TrianGle_Options,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashedArray,
        },
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = Diamond_Options.height;
      const WIDTH = Diamond_Options.width;
      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },

          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...Diamond_Options,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          strokeDashArray: strokeDashedArray,
        },
      );
      addToCanvas(object);
    },
    canvas,
    getActiveFillCOLOR: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return fillColor;
      }

      const value = selectedObject.get("fill") || fillColor;

      return value as string;
    },
    getActiveSTROKECOLOR: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeColor;
      }

      const value =
        selectedObject.get("stroke") ||
        selectedObject.get("strokeColor") ||
        strokeColor;

      return value as string;
    },
    getActiveSTROKEWIDTH: () => {
      const selectedObject = selectedObjects[0];
      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") ?? strokeWidth;

      return value as number;
    },
    getActiveSTROKEDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashedArray;
      }

      const value = selectedObject.get("strokeDashArray") ?? strokeDashedArray;

      return value as number[];
    },

    selectedObjects,
  };
};

export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [fillColor, setFillColor] = useState(Fill_COl);
  const [strokeColor, setStrokeColor] = useState(Stroke_COl);
  const [strokeWidth, setStrokeWidth] = useState(stroke_WIDTH);
  const [strokeDashedArray, setStrokeDashedArray] =
    useState<number[]>(stroke_Dashed_Array);

  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObjects,
        strokeDashedArray,
        setStrokeDashedArray,
      });
    }
    return undefined;
  }, [
    canvas,
    fillColor,
    setFillColor,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    selectedObjects,
    strokeDashedArray,
  ]);
  const init = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      FabricObject.ownDefaults.cornerColor = "#FFF";
      FabricObject.ownDefaults.cornerStyle = "circle";
      FabricObject.ownDefaults.borderColor = "#3b82f6";
      FabricObject.ownDefaults.borderScaleFactor = 1.5;
      FabricObject.ownDefaults.transparentCorners = false;
      FabricObject.ownDefaults.borderOpacityWhenMoving = 1;
      FabricObject.ownDefaults.cornerStrokeColor = "#3b82f6";

      const initialWorkspace = new Rect({
        width: 900,
        height: 1200,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.setDimensions({
        width: initialContainer.offsetWidth,
        height: initialContainer.offsetHeight,
      });

      initialCanvas.add(initialWorkspace);
      //   initialCanvas.requestRenderAll()
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    [],
  );

  return { init, editor };
};

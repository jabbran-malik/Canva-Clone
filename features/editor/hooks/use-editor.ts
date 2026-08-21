import { Canvas, FabricObject, Rect, Shadow } from "fabric";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import * as fabric from "fabric";
import {
  BuildEditorProps,
  Circle_Options,
  Diamond_Options,
  Editor,
  Fill_COl,
  Rectangle_Options,
  Stroke_COl,
  stroke_WIDTH,
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

    addCircle: () => {
      const object = new fabric.Circle({
        ...Circle_Options,
        fill:fillColor,
        stroke:strokeColor,
        strokeWidth:strokeWidth,
      });
      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...Rectangle_Options,
        rx: 10,
        ry: 10,
                fill:fillColor,
        stroke:strokeColor,
        strokeWidth:strokeWidth,
      });
      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...Rectangle_Options,
                fill:fillColor,
        stroke:strokeColor,
        strokeWidth:strokeWidth,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TrianGle_Options,
                fill:fillColor,
        stroke:strokeColor,
        strokeWidth:strokeWidth,
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
                  fill:fillColor,
        stroke:strokeColor,
        strokeWidth:strokeWidth,
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
                  fill:fillColor,
        stroke:strokeColor,
        strokeWidth:strokeWidth,
        },
      );
      addToCanvas(object);
    },
    canvas,
    fillColor,
    strokeColor,
    strokeWidth,
    selectedObjects,
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const [fillColor, setFillColor] = useState(Fill_COl);
  const [strokeColor, setStrokeColor] = useState(Stroke_COl);
  const [strokeWidth, setStrokeWidth] = useState(stroke_WIDTH);

  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,

    setSelectedObjects,
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

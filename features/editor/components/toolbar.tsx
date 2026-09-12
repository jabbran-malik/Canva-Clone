import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ActiveTool, Editor, FONT_FAMILY, FONT_WEIGHT } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "../utilis";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { useState } from "react";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const selectedObjectType = editor?.selectedObjects[0]?.type;

  const isText = isTextType(selectedObjectType);
  const initialFILLCOLOR = editor?.getActiveFillCOLOR();
  const initialSTROKECOLOR = editor?.getActiveSTROKECOLOR();
  const initialFONTFAMILY = editor?.getActivefontFamily();
  const initialFONTWEIGHT = editor?.getActivefontWeight() || FONT_WEIGHT;
  const initialFONTSTYLE = editor?.getActivefontStyle() ?? "normal";
  const initialFONTLINETHROUGH = editor?.getActiveFontLinethrough();
  const initialFONTUNDERLINE = editor?.getActiveFontUnderline();;
  const initialTEXTALIGN = editor?.getActivetextAlign();;


  const [properties, setProperties] = useState({
    FILLCOLOR: initialFILLCOLOR,
    STROKECOLOR: initialSTROKECOLOR,
    FONTFAMILY: initialFONTFAMILY,
    FONTWEIGHT: initialFONTWEIGHT,
    fontStyle: initialFONTSTYLE,
    fontLineThrough: initialFONTLINETHROUGH,
    fontUnderline: initialFONTUNDERLINE,
    textAlign: initialTEXTALIGN,
  });






  const toggleBold = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }

    const newValue = properties.FONTWEIGHT > 500 ? 500 : 700;
    editor?.changeFontWeight(newValue);
    setProperties((current) => ({
      ...current,
      FONTWEIGHT: newValue,
    }));
  };

  const onChangeTextAlign = (value: "left" | "center" | "right") => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }

    editor?.changeTextAlign(value);
    setProperties((current) => ({
      ...current,
      textAlign: value,
    }));
  };

  const toggleItalic = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((current) => ({
      ...current,
      fontStyle: newValue,
    }));
  };

  const toggleLinethrough = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }

    const newValue = !properties.fontLineThrough;

    editor?.changeFontLinethrough(newValue);
    setProperties((current) => ({
      ...current,
      fontLineThrough: newValue,
    }));
  };

  const toggleUnderline = () => {
    const selectedObject = editor?.selectedObjects[0];
    if (!selectedObject) {
      return;
    }

    const newValue = !properties.fontUnderline;

    editor?.changeFontUnderline(newValue);
    setProperties((current) => ({
      ...current,
      fontUnderline: newValue,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
      <div className="shrink-0 h-[56] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
        <div className="flex items-center h-full justify-center">
          <Hint label="Color" side="bottom" sideoffset={5}>
            <Button
              onClick={() => onChangeActiveTool("fill")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "fill" && "bg-gray-100")}
            >
              <div
                className="rounded-sm size-4 border"
                style={{
                  backgroundColor: properties.FILLCOLOR,
                }}
              />
            </Button>
          </Hint>
        </div>
        {!isText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="Stroke Color" side="bottom" sideoffset={5}>
              <Button
                onClick={() => onChangeActiveTool("stroke-color")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-color" && "bg-gray-100")}
              >
                <div
                  className="rounded-sm size-4 border-2 bg-white"
                  style={{
                    borderColor: properties.STROKECOLOR,
                  }}
                />
              </Button>
            </Hint>
          </div>
        )}
        {!isText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="Stroke width" side="bottom" sideoffset={5}>
              <Button
                onClick={() => onChangeActiveTool("stroke-width")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "stroke-color" && "bg-gray-100")}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
        )}
        {isText && (
          <div className="flex items-center h-full justify-center">
            <Hint label="Font" side="bottom" sideoffset={5}>
              <Button
                onClick={() => onChangeActiveTool("font")}
                size="icon"
                variant="ghost"
                className={cn(
                  "w-auto px-2 text-sm",
                  activeTool === "font" && "bg-gray-100")}
              >
                <div className="max-w-[300px] truncate">
                  {properties.FONTFAMILY}
                </div>
                <ChevronDown className="size-4 ml-2 shrink-0 " />
              </Button>
            </Hint>
          </div>

        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="Bold" side="bottom" sideoffset={5}>
            <Button
              onClick={toggleBold}
              size="icon"
              variant="ghost"
              className={cn(properties.FONTWEIGHT > 500 && "bg-gray-100")}
            >
              <FaBold className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="italic" side="bottom" sideoffset={5}>
            <Button
              onClick={toggleItalic}
              size="icon"
              variant="ghost"
              //@ts-ignore
              className={cn(properties.fontStyle === "italic" && "bg-gray-100")}
            >
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="Underline" side="bottom" sideoffset={5}>
            <Button
              onClick={toggleUnderline}
              size="icon"
              variant="ghost"
              //@ts-ignore
              className={cn(properties.fontUnderline && "bg-gray-100")}
            >
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="Strike" side="bottom" sideoffset={5}>
            <Button
              onClick={toggleLinethrough}
              size="icon"
              variant="ghost"
              //@ts-ignore
              className={cn(properties.fontLineThrough && "bg-gray-100")}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="align left" side="bottom" sideoffset={5}>
            <Button
              onClick={()=>onChangeTextAlign("left")}
              size="icon"
              variant="ghost"
              //@ts-ignore
              className={cn(properties.textAlign ==="left" && "bg-gray-100")}
            >
              <AlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="align Center" side="bottom" sideoffset={5}>
            <Button
              onClick={()=>onChangeTextAlign("center")}
              size="icon"
              variant="ghost"
              //@ts-ignore
              className={cn(properties.textAlign ==="center" && "bg-gray-100")}
            >
              <AlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        {isText && (<div className="flex items-center h-full justify-center">
          <Hint label="Align right" side="bottom" sideoffset={5}>
            <Button
              onClick={()=>onChangeTextAlign("right")}
              size="icon"
              variant="ghost"
              //@ts-ignore
              className={cn(properties.textAlign ==="right" && "bg-gray-100")}
            >
              <AlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
        )}
        <div className="flex items-center h-full justify-center">
          <Hint label="Bring Forward" side="bottom" sideoffset={5}>
            <Button
              onClick={() => editor?.bringforward()}
              size="icon"
              variant="ghost"
            >
              <ArrowUp className="size-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center h-full justify-center">
          <Hint label="Send Backwards" side="bottom" sideoffset={5}>
            <Button
              onClick={() => editor?.sendBackwards()}
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="size-4" />
            </Button>
          </Hint>
        </div>
        <div className="flex items-center h-full justify-center">
          <Hint label="Opacity" side="bottom" sideoffset={5}>
            <Button
              onClick={() => onChangeActiveTool("opacity")}
              size="icon"
              variant="ghost"
              className={cn(activeTool === "opacity" && "bg-gray-100")}
            >
              <RxTransparencyGrid className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    );
  };



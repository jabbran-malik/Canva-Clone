import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { BsBorderWidth } from "react-icons/bs";

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
  // const selectedObject = editor?.canvas.getActiveObject();
  // const getProperty = (property: any) => {
  //   if (!selectedObject) return null;
  //   return selectedObject.get(property);
  // };

  const FILLCOLOR = editor?.getActiveFillCOLOR();
  const STROKECOLOR =editor?.getActiveSTROKECOLOR();
  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }
  // const [properties, setProperties] = useState({ FILLCOLOR });

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
                backgroundColor: FILLCOLOR,
              }}
            />
          </Button>
        </Hint>
        </div>
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
                borderColor: STROKECOLOR,
              }}
            />
          </Button>
        </Hint>
      </div>
         <div className="flex items-center h-full justify-center">
        <Hint label="Stroke width" side="bottom" sideoffset={5}>
          <Button
            onClick={() => onChangeActiveTool("stroke-width")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "stroke-color" && "bg-gray-100")}
          >
            <BsBorderWidth className="size-4"/>
          </Button>
        </Hint>
      </div>
    </div>
  );
};

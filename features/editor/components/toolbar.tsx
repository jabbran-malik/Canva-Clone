import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";

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

  const FILLCOLOR = editor?.fillColor;
  if(editor?.selectedObjects.length===0){
   return     <div className="shrink-0 h-[56] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2"/>
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
    </div>
  );
};

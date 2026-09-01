import { ActiveTool, Editor, stroke_Dashed_Array, stroke_WIDTH } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSideBarClose } from "@/features/editor/components/tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface strokeWidthSidebarprops {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const StrokeWidthSiderbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: strokeWidthSidebarprops) => {
  const widthValue = editor?.getActiveSTROKEWIDTH() || stroke_WIDTH;
  const typeValue = editor?.getActiveSTROKEDashArray() || stroke_Dashed_Array;

  const onClose = () => {
    onChangeActiveTool("select");
  };
  const onchangeStrokeWidth= (value: number) => {
    editor?.changeStrokeWidth(value);
  };
  const onChangeStrokeType=(value : number[]) =>{
    console.log("button clicked")
    editor?.changeStrokeDashedArray(value);
  }

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "stroke-width" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Stroke options"
        description="Modify the stroke of your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke Width</Label>
          <Slider
            value={[widthValue]}
            min={1}
            max={100}
            step={1}
            onValueChange={(values) => {
              const newValue = Array.isArray(values) ? values[0] : values;
              onchangeStrokeWidth(newValue);
            }}
          />
        </div>
        <div className="p-4 space-y-4 border-b">
          <Label className="text-sm">Stroke Type</Label>
          <Button
           onClick={()=>onChangeStrokeType([])}
            variant="secondary"
            size="lg"
            className={cn("w-full h-16 justify-start text-left",
              JSON.stringify(typeValue)=== `[]` && "border-2 border-blue-500"
            )}
            style={{
              padding: "8px 16px",
            }}
          >
            <div className="w-full border-black rounded-full border-4 "></div>
          </Button>
          <Button
          onClick={()=>onChangeStrokeType([5,5])}
            variant="secondary"
            size="lg"
            className={cn("w-full h-16 justify-start text-left",
              JSON.stringify(typeValue)=== `[5,5]` && "border-2 border-blue-500"
            )}
            style={{
              padding: "8px 16px",
            }}
          >
            <div className="w-full border-black rounded-full border-4 border-dashed"></div>
            
          </Button>
          
        </div>
      </ScrollArea>

      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};

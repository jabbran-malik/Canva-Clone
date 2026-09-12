import { ActiveTool, Editor, stroke_Dashed_Array, stroke_WIDTH } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSideBarClose } from "@/features/editor/components/tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { useEffect, useMemo, useState } from "react";

interface Opacitysidebarprops {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const OpacitySidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: Opacitysidebarprops) => {
  const initialValue = editor?.getActiveOpacity() || 1;
  const selectedObject=useMemo(()=> editor?.selectedObjects[0],[editor?.selectedObjects[0]])
const [opacity ,setOpacity]=useState(initialValue)
useEffect(()=>{
  if (selectedObject){
    setOpacity(selectedObject.get("opacity")||1)
  }
},[selectedObject])
  const onClose = () => {
    onChangeActiveTool("select");
  };
  const onChange = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value)
  };


  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "opacity" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Opacity"
        description="Change the opacity of the selected object"
      />
      <ScrollArea>
        <div className="p-4 space-y-4 border-b">
          <Slider
            value={[opacity]}
            onValueChange={(values) => {
              const newValue = Array.isArray(values) ? values[0] : values;
              onChange(newValue);
            }}
            min={0}
            max={1}
            step={0.01}
          />
        </div>

      </ScrollArea>

      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};

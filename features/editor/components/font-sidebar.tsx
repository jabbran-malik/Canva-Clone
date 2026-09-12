import { ActiveTool, Editor, fonts } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSideBarClose } from "@/features/editor/components/tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";


interface FontSideBarprops {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const FontSideBar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FontSideBarprops) => {
  const value=editor?.getActivefontFamily()
  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "font" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader title="Font" description="Change the text font" />
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-1 border-b">
          {fonts.map((font) => (
            <Button
            key={font}
            variant='secondary'
            size='lg'
        className={cn("w-full h-16 justify-start text-left", value===font && "border-2 border-blue-500",)}
            style={{
              fontFamily: font,
              fontSize: "16px",
              padding: "8px 16px"
            }}
            onClick={()=>editor?.changeFontFamily(font)}
          >
            {font}

          </Button>))}
          
        </div>
      </ScrollArea>
      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};

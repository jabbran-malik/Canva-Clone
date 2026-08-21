import { ActiveTool, Editor, Fill_COl } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { ToolSideBarClose } from "@/features/editor/components/tool-siderbar-close";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/features/editor/components/color-picker";

interface FillColorSiderbarProps {
  activeTool: ActiveTool;
  editor: Editor | undefined;
  onChangeActiveTool: (tool: ActiveTool) => void;
}
export const FillColorSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FillColorSiderbarProps) => {
  const value = editor?.fillColor || Fill_COl;

  const onClose = () => {
    onChangeActiveTool("select");
  };
  const onChange = (value: string) => {
    editor?.changeFillColor(value);
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "fill" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Fill color"
        description="Add Fill color to your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>

      <ToolSideBarClose onClick={onClose} />
    </aside>
  );
};

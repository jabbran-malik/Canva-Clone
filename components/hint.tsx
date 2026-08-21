import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface HintProps {
    label: string;
    children: React.ReactElement;
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
    sideoffset?: number;
    alignoffset?: number;
}
export const Hint = ({
    label,
    children,
    side,
    align,
    sideoffset,
    alignoffset
}
    : HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger render={children} />
                <TooltipContent className="text-white bg-slate-800 border-Slate-800"
                side={side}
                align={align}
                sideOffset={sideoffset}
                alignOffset={alignoffset}
                >
                    <p className="font-semibold capitalize">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

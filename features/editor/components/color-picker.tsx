"use client";

import dynamic from "next/dynamic";
import { colors } from "@/features/editor/types";
import { rgbaObjectTostring } from "@/features/editor/utilis";

// react-color's Checkboard paints its transparency grid onto a <canvas> and
// inlines the result as a data URI. On the server there is no `document`, so it
// emits `url(null)` instead -- which never matches what the client renders and
// breaks hydration. Load both pickers on the client only.
const ChromePicker = dynamic(
  () => import("react-color").then((mod) => mod.ChromePicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] w-[225px] rounded-lg border bg-muted animate-pulse" />
    ),
  },
);

const CirclePicker = dynamic(
  () => import("react-color").then((mod) => mod.CirclePicker),
  {
    ssr: false,
    loading: () => <div className="h-[110px] w-full" />,
  },
);

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="w-full space-y-4 ">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formattedValue = rgbaObjectTostring(color.rgb);
          onChange(formattedValue);
        }}
        className="border rounded-lg"
      />
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formattedValue = rgbaObjectTostring(color.rgb);
          onChange(formattedValue);
        }}
      />
    </div>
  );
};

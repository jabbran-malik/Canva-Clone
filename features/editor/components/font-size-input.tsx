import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(value - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onChange(value);
  };
  return (
    <div className="flex h-8 items-center overflow-hidden rounded-md border border-input">
      <Button
        variant="outline"
        className="h-8 w-8 rounded-none border-0 p-2"
        size="icon"
        onClick={decrement}
      >
        <Minus className="size-4" />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-[50px] rounded-none border-0 bg-background p-0 hover:bg-background"
      >
        <input className="w-[50px] h-8 bg-background text-center text-foreground focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none" onChange={handleChange} value={value} />
      </Button>
      <Button
        variant="outline"
        className="h-8 w-8 rounded-none border-0 p-2"
        size="icon"
        onClick={increment}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};

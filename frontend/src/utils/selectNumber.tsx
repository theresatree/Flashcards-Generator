import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../components/ui/select";

interface NumberSelectProps {
  value: number;
  onChange?: (value: number) => void;
}

export function NumberSelect({ value, onChange }: NumberSelectProps) {
  // Keep the “truth” as a number
  const [num, setNum] = useState<number>(value);

  const handleChange = (val: string) => {
    const parsed = Number(val);
    setNum(parsed);
    onChange?.(parsed);
  };

  return (
    <Select value={num.toString()} onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a number" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

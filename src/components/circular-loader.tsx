import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type CircularLoaderProps = {
  className?: string;
  size?: number;
};

function CircularLoader({ className, size = 20 }: CircularLoaderProps) {
  return (
    <Loader2
      className={cn("animate-spin mx-auto", className)}
      size={size}
    />
  );
}
export default CircularLoader;

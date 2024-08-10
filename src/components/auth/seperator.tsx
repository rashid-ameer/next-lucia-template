import { cn } from "@/lib/utils";

type SeperatorProps = {
  className?: string;
};

function Seperator({ className }: SeperatorProps) {
  return (
    <div className={cn("flex items-center py-2", className)}>
      <div className="flex-1 h-px bg-gray-200" />
      <div className="mx-2 text-gray-500">or</div>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}
export default Seperator;

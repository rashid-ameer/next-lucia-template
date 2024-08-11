import { cn } from "@/lib/utils";

type FormServerErrorProps = {
  className?: string;
  message: string;
};

function FormServerError({ className, message }: FormServerErrorProps) {
  return (
    <p
      className={cn(
        "text-sm font-medium text-red-500 dark:text-red-900",
        className
      )}>
      {message}
    </p>
  );
}
export default FormServerError;

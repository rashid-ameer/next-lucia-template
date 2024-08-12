import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Link from "next/link";
import { PATHS } from "@/lib/constants";

function VerificationAlert() {
  return (
    <Alert className="absolute top-4 max-w-xl rounded-lg bg-yellow-50 text-yellow-700 ">
      <ExclamationTriangleIcon className="!text-yellow-700 " />
      <div className="flex">
        <div className="flex-1">
          <AlertTitle>Verify Email</AlertTitle>
          <AlertDescription>
            Verify your email to access all the features of app
          </AlertDescription>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm">
          <Link href={PATHS.VERIFY_EMAIL}>Verify Email</Link>
        </Button>
      </div>
    </Alert>
  );
}
export default VerificationAlert;

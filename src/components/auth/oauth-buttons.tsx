import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { GitHubLogoIcon, GoogleLogoIcon } from "@/components/icons";

type OAuthButtonProps = {
  githubText: string;
  googleText: string;
  className?: string;
};

function OAuthButtons({ githubText, googleText, className }: OAuthButtonProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        variant="outline"
        className="flex-1"
        asChild>
        <Link
          href={"/login/github"}
          prefetch={false}>
          <GitHubLogoIcon className="size-5 mr-2" />
          Login with GitHub
        </Link>
      </Button>
      <Button
        variant="outline"
        className="flex-1"
        asChild>
        <Link
          href={"/login/google"}
          prefetch={false}>
          <GoogleLogoIcon className="size-5 mr-2" />
          Login with Google
        </Link>
      </Button>
    </div>
  );
}
export default OAuthButtons;

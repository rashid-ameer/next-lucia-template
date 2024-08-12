import { validateRequest } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

async function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login", RedirectType.replace);
  }

  return <>{children}</>;
}
export default MainLayout;

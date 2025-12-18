import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import { db } from "@/db/index";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

import { AppSidebar } from "./components/sidebar/app-sidebar";
import { Toaster } from "sonner";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Verificar se o usuário está ativo
  const [user] = await db
    .select({ isActive: usersTable.isActive })
    .from(usersTable)
    .where(eq(usersTable.id, session.user.id))
    .limit(1);

  if (!user || !user.isActive) {
    redirect("/authentication");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
        <Toaster position="bottom-center" richColors theme="light" />
      </main>
    </SidebarProvider>
  );
}

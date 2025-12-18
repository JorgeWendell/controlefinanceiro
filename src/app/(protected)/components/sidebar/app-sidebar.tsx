"use client";

import {
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  PiggyBank,
  Settings,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

import { NavMain } from "./nav-main";

// This is sample data.
// Label = modules  - items = menus  - title = o que vai fazer
const data = {
  navMain: [
    {
      label: "Menu",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
          items: [
            {
              title: "Dashboard",
              url: "/dashboard",
            },
          ],
        },
        {
          title: "Financeiro",
          icon: TrendingUp,
          items: [
            {
              title: "Ganhos",
              url: "/ganhos",
            },
            {
              title: "Despesas Fixas",
              url: "/despesas-fixas",
            },
            {
              title: "Despesas Variáveis",
              url: "/despesas-variaveis",
            },
            {
              title: "Dívidas",
              url: "/dividas",
            },
            {
              title: "Metas",
              url: "/metas",
            },
            {
              title: "Investimentos",
              url: "/investimentos",
            },
          ],
        },
        {
          title: "Relatórios",
          icon: FileText,
          items: [
            {
              title: "Relatório Geral",
              url: "/relatorios",
            },
            {
              title: "Relatório Mensal",
              url: "/relatorios/mensal",
            },
            {
              title: "Relatório Anual",
              url: "/relatorios/anual",
            },
          ],
        },
        {
          title: "Configurações",
          icon: Settings,
          items: [
            {
              title: "Contas Bancárias",
              url: "/contas-bancarias",
            },
            {
              title: "Categorias",
              url: "/categorias",
            },
          ],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const session = authClient.useSession();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
        },
      },
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="mx-auto mt-4"
      />
      <SidebarContent>
        <NavMain groups={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar>
                    <AvatarFallback>
                      {session.data?.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{session.data?.user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {session.data?.user.email}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={toggleTheme}>
                  {mounted && theme === "dark" ? (
                    <>
                      <Sun />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Moon />
                      Dark Mode
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

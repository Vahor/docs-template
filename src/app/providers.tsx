import { SidebarProvider } from "@/components/ui/sidebar";

export function Providers({ children }: React.PropsWithChildren) {
	return <SidebarProvider>{children}</SidebarProvider>;
}

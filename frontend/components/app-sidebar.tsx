import { FolderOpenDot, BookOpen, Info } from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { ProfileCard } from '@/components/ProfileCard';

// Menu items.
const items = [
  {
    title: "Projects",
    url: "#",
    icon: FolderOpenDot,
  },
  {
    title: "Docs",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "About",
    url: "#",
    icon: Info,
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        {/* //todo : place logo here  */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>IntelliOps</SidebarGroupLabel> {/* //todo : replace this with logo  */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ProfileCard />
      </SidebarFooter>
    </Sidebar>
  );
}

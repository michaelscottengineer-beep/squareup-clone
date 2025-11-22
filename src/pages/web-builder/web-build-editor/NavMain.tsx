
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
    popover?: React.FC<{ children?: React.ReactNode }>;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.popover && (
              <item.popover>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="cursor-pointer hover:bg-primary/20"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </item.popover>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

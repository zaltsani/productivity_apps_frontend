'use client'

import { Calendar, Home, SquareCheck, Inbox, Search, Settings, ListTodo, AlarmClockCheck, GalleryVerticalEnd, PencilIcon, Wallet, Notebook, Wand } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Task",
    url: "/task",
    icon: SquareCheck,
  },
  {
    title: "Article",
    url: "/article",
    icon: PencilIcon,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: Wallet,
  },
  {
    title: "Daily Journal",
    url: "/journal",
    icon: Notebook,
  },
  // {
  //   title: "To Do List",
  //   url: "/todo",
  //   icon: ListTodo,
  // },
  // {
  //   title: "Pomodoro",
  //   url: "/pomodoro",
  //   icon: AlarmClockCheck,
  // },
  // {
  //   title: "Inbox",
  //   url: "#",
  //   icon: Inbox,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Homework for Life",
    url: "/story",
    icon: Wand,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd />
          </div>
          <div className="grid flex-1 text-left text-xl leading-tight">
            <span className="truncate font-semibold">
              Productivity
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    // className={`text-md ${pathname === item.url ? 'bg-sidebar-accent' : ''}`}
                  >
                    <Link href={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

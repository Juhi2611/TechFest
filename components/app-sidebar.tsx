"use client"

import { useAuth } from "@/lib/auth-context"
import { ROLE_LABELS, type UserRole } from "@/lib/types"
import { NOTIFICATIONS } from "@/lib/data"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  ListTodo,
  Users,
  Bell,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Rocket,
  ChevronsUpDown,
  Link2,
  Activity,
} from "lucide-react"

interface NavItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  page: string
  badge?: number
}

function getNavItems(role: UserRole): NavItem[] {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length
  const base: NavItem[] = [
    { title: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
  ]

  switch (role) {
    case "super_admin":
      return [
        ...base,
        { title: "Events", icon: CalendarDays, page: "events" },
        { title: "Registrations", icon: ClipboardList, page: "registrations" },
        { title: "Tasks", icon: ListTodo, page: "tasks" },
        { title: "Users", icon: Users, page: "users" },
        { title: "Reports", icon: BarChart3, page: "reports" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
        { title: "Activity Log", icon: Activity, page: "activity" },
        { title: "Settings", icon: Settings, page: "settings" },
      ]
    case "admin":
      return [
        ...base,
        { title: "Events", icon: CalendarDays, page: "events" },
        { title: "Registrations", icon: ClipboardList, page: "registrations" },
        { title: "Tasks", icon: ListTodo, page: "tasks" },
        { title: "Reports", icon: BarChart3, page: "reports" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
      ]
    case "faculty_coordinator":
      return [
        ...base,
        { title: "My Events", icon: CalendarDays, page: "events" },
        { title: "Registrations", icon: ClipboardList, page: "registrations" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
      ]
    case "club_coordinator":
      return [
        ...base,
        { title: "Club Events", icon: CalendarDays, page: "events" },
        { title: "Registrations", icon: ClipboardList, page: "registrations" },
        { title: "Volunteers", icon: Users, page: "users" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
      ]
    case "team_lead":
      return [
        ...base,
        { title: "Tasks", icon: ListTodo, page: "tasks" },
        { title: "Team", icon: Users, page: "users" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
      ]
    case "volunteer":
      return [
        ...base,
        { title: "My Tasks", icon: ListTodo, page: "tasks" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
      ]
    case "campus_ambassador":
      return [
        ...base,
        { title: "Referrals", icon: Link2, page: "referrals" },
        { title: "Notifications", icon: Bell, page: "notifications", badge: unreadCount },
      ]
    default:
      return base
  }
}

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { user, logout, switchRole } = useAuth()

  if (!user) return null

  const navItems = getNavItems(user.role)
  const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase()

  const allRoles: UserRole[] = [
    "super_admin",
    "admin",
    "faculty_coordinator",
    "club_coordinator",
    "team_lead",
    "volunteer",
    "campus_ambassador",
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="pointer-events-none">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Rocket className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-sm">TechFest</span>
                <span className="text-xs text-sidebar-foreground/60">Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    isActive={currentPage === item.page}
                    onClick={() => onNavigate(item.page)}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && item.badge > 0 ? (
                    <SidebarMenuBadge className="bg-primary/10 text-primary text-[10px] font-bold rounded-full min-w-5 h-5">
                      {item.badge}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Role Switcher</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton tooltip="Switch Role">
                      <Shield className="h-4 w-4" />
                      <span className="truncate">{ROLE_LABELS[user.role]}</span>
                      <ChevronsUpDown className="ml-auto h-3 w-3 text-sidebar-foreground/50" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {allRoles.map((role) => (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => {
                          switchRole(role)
                          onNavigate("dashboard")
                        }}
                        className={user.role === role ? "bg-accent/10 text-primary" : ""}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold bg-primary/10 text-primary">
                          {ROLE_LABELS[role].charAt(0)}
                        </span>
                        {ROLE_LABELS[role]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip={user.name}>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-sm font-medium truncate">{user.name}</span>
                    <span className="text-xs text-sidebar-foreground/60 truncate">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-3 w-3 text-sidebar-foreground/50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => onNavigate("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

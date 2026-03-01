"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ROLE_LABELS } from "@/lib/types"
import { AppSidebar } from "@/components/app-sidebar"
import { LoginPage } from "@/components/login-page"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { EventsPage } from "@/components/pages/events-page"
import { RegistrationsPage } from "@/components/pages/registrations-page"
import { TasksPage } from "@/components/pages/tasks-page"
import { UsersPage } from "@/components/pages/users-page"
import { ReportsPage } from "@/components/pages/reports-page"
import { NotificationsPage } from "@/components/pages/notifications-page"
import { ActivityPage } from "@/components/pages/activity-page"
import { ReferralsPage } from "@/components/pages/referrals-page"
import { SettingsPage } from "@/components/pages/settings-page"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  events: "Events",
  registrations: "Registrations",
  tasks: "Tasks",
  users: "Users",
  reports: "Reports",
  notifications: "Notifications",
  activity: "Activity Log",
  referrals: "Referrals",
  settings: "Settings",
}

function PageContent({ page }: { page: string }) {
  switch (page) {
    case "dashboard":
      return <DashboardPage />
    case "events":
      return <EventsPage />
    case "registrations":
      return <RegistrationsPage />
    case "tasks":
      return <TasksPage />
    case "users":
      return <UsersPage />
    case "reports":
      return <ReportsPage />
    case "notifications":
      return <NotificationsPage />
    case "activity":
      return <ActivityPage />
    case "referrals":
      return <ReferralsPage />
    case "settings":
      return <SettingsPage />
    default:
      return <DashboardPage />
  }
}

export function AppShell() {
  const { isAuthenticated, user } = useAuth()
  const [currentPage, setCurrentPage] = useState("dashboard")

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-xs text-muted-foreground">
                  {user ? ROLE_LABELS[user.role] : ""}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-medium">
                  {PAGE_TITLES[currentPage] || "Dashboard"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <PageContent page={currentPage} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

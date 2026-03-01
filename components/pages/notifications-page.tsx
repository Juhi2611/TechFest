"use client"

import { useState } from "react"
import { NOTIFICATIONS } from "@/lib/data"
import type { Notification } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

const TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; style: string }> = {
  info: { icon: Info, style: "text-primary bg-primary/10" },
  success: { icon: CheckCircle2, style: "text-success bg-success/10" },
  warning: { icon: AlertTriangle, style: "text-warning bg-warning/10" },
  error: { icon: XCircle, style: "text-destructive bg-destructive/10" },
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
              <Bell className="h-10 w-10" />
              <p className="text-sm">No notifications yet</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type]
            const Icon = config.icon
            return (
              <Card
                key={notif.id}
                className={`border-border/50 cursor-pointer transition-colors hover:bg-secondary/30 ${
                  !notif.read ? "bg-primary/[0.02] border-primary/10" : ""
                }`}
                onClick={() => toggleRead(notif.id)}
              >
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.style}`}>
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{notif.title}</p>
                      {!notif.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

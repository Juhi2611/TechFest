"use client"

import { ACTIVITY_LOGS } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ACTION_STYLES: Record<string, string> = {
  "Created Event": "bg-primary/10 text-primary",
  "Approved Registration": "bg-success/10 text-success",
  "Completed Task": "bg-success/10 text-success",
  "Created Admin": "bg-primary/10 text-primary",
  "Updated Task": "bg-warning/10 text-warning-foreground",
}

export function ActivityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity Log</h1>
        <p className="text-muted-foreground">Complete audit trail of system actions</p>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="flex flex-col">
            {ACTIVITY_LOGS.map((log, i) => (
              <div
                key={log.id}
                className={`flex items-start gap-4 px-6 py-4 ${
                  i < ACTIVITY_LOGS.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="relative flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {log.userName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  {i < ACTIVITY_LOGS.length - 1 && (
                    <div className="absolute top-8 h-full w-px bg-border/50" />
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{log.userName}</span>
                    <Badge variant="outline" className={ACTION_STYLES[log.action] || "bg-muted text-muted-foreground"}>
                      {log.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  {new Date(log.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useAuth } from "@/lib/auth-context"
import { EVENTS, REGISTRATIONS, TASKS, ACTIVITY_LOGS } from "@/lib/data"
import { ROLE_LABELS } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CalendarDays,
  Users,
  ClipboardList,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const STATUS_COLORS = {
  upcoming: "bg-primary/10 text-primary",
  ongoing: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
}

const registrationData = [
  { name: "Week 1", registrations: 45 },
  { name: "Week 2", registrations: 78 },
  { name: "Week 3", registrations: 120 },
  { name: "Week 4", registrations: 156 },
  { name: "Week 5", registrations: 210 },
  { name: "Week 6", registrations: 280 },
  { name: "Week 7", registrations: 340 },
]

const eventCategoryData = [
  { name: "Workshop", value: 2 },
  { name: "Competition", value: 3 },
  { name: "Talk", value: 1 },
]

const CHART_COLORS = [
  "oklch(0.45 0.18 265)",
  "oklch(0.62 0.19 145)",
  "oklch(0.65 0.18 45)",
]

export function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const totalEvents = EVENTS.length
  const totalRegistrations = REGISTRATIONS.length
  const totalTasks = TASKS.length
  const completedTasks = TASKS.filter((t) => t.status === "completed").length
  const pendingRegistrations = REGISTRATIONS.filter((r) => r.status === "pending").length
  const upcomingEvents = EVENTS.filter((e) => e.status === "upcoming").length

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      change: "+2 this month",
      icon: CalendarDays,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Registrations",
      value: EVENTS.reduce((acc, e) => acc + e.currentRegistrations, 0),
      change: "+89 this week",
      icon: Users,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      title: "Pending Approvals",
      value: pendingRegistrations,
      change: "Needs attention",
      icon: ClipboardList,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      title: "Task Completion",
      value: `${Math.round((completedTasks / totalTasks) * 100)}%`,
      change: `${completedTasks}/${totalTasks} done`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          {ROLE_LABELS[user.role]} Dashboard &middot; Here{"'"}s your overview for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Registration Trend</CardTitle>
            <CardDescription>Weekly registration count over the past 7 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationData}>
                  <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.45 0.18 265)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.45 0.18 265)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 247)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 260)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 260)" />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.995 0.001 247)",
                      border: "1px solid oklch(0.91 0.01 247)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="oklch(0.45 0.18 265)"
                    strokeWidth={2}
                    fill="url(#colorReg)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Events by Category</CardTitle>
            <CardDescription>Distribution across event types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {eventCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.995 0.001 247)",
                      border: "1px solid oklch(0.91 0.01 247)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {eventCategoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[i] }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Upcoming Events */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Upcoming Events</CardTitle>
            <CardDescription>{upcomingEvents} events scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {EVENTS.filter((e) => e.status === "upcoming")
                .slice(0, 4)
                .map((event) => {
                  const pct = Math.round((event.currentRegistrations / event.maxRegistrations) * 100)
                  return (
                    <div key={event.id} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium text-foreground leading-snug">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date} &middot; {event.venue}
                          </p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 ${STATUS_COLORS[event.status]}`}>
                          {event.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {event.currentRegistrations}/{event.maxRegistrations}
                        </span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest actions across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {ACTIVITY_LOGS.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                    {log.userName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{log.userName}</span>{" "}
                      <span className="text-muted-foreground">{log.action.toLowerCase()}</span>
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                  </div>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

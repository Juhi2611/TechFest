"use client"

import { EVENTS, REGISTRATIONS, TASKS } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download, CalendarDays, Users, TrendingUp, DollarSign } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const registrationsByEvent = EVENTS.map((e) => ({
  name: e.title.length > 20 ? e.title.substring(0, 20) + "..." : e.title,
  registrations: e.currentRegistrations,
  max: e.maxRegistrations,
}))

const revenueData = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 12500 },
  { month: "Mar", revenue: 45000 },
]

const taskStatusData = [
  { name: "To Do", value: TASKS.filter((t) => t.status === "todo").length },
  { name: "In Progress", value: TASKS.filter((t) => t.status === "in_progress").length },
  { name: "Completed", value: TASKS.filter((t) => t.status === "completed").length },
]

const COLORS = [
  "oklch(0.5 0.02 260)",
  "oklch(0.45 0.18 265)",
  "oklch(0.62 0.19 145)",
]

export function ReportsPage() {
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const totalRegistrations = EVENTS.reduce((sum, e) => sum + e.currentRegistrations, 0)
  const avgPerEvent = Math.round(totalRegistrations / EVENTS.length)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analytics and export data</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-xl font-bold text-foreground">{EVENTS.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
                <p className="text-xl font-bold text-foreground">{totalRegistrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg per Event</p>
                <p className="text-xl font-bold text-foreground">{avgPerEvent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Registrations by Event</CardTitle>
                <CardDescription>Current vs maximum capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationsByEvent} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 247)" />
                      <XAxis type="number" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 260)" />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} stroke="oklch(0.5 0.02 260)" />
                      <Tooltip
                        contentStyle={{
                          background: "oklch(0.995 0.001 247)",
                          border: "1px solid oklch(0.91 0.01 247)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="registrations" fill="oklch(0.45 0.18 265)" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="max" fill="oklch(0.91 0.01 247)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Event-wise Data</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead className="text-right">Registered</TableHead>
                      <TableHead className="text-right">Capacity</TableHead>
                      <TableHead className="text-right">Fill %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {EVENTS.map((event) => {
                      const pct = Math.round((event.currentRegistrations / event.maxRegistrations) * 100)
                      return (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium text-foreground text-sm">{event.title}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{event.currentRegistrations}</TableCell>
                          <TableCell className="text-right text-muted-foreground">{event.maxRegistrations}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={pct >= 90 ? "default" : "secondary"} className="text-xs">
                              {pct}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="mt-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">Revenue Tracking</CardTitle>
              <CardDescription>Monthly revenue from paid events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 247)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 260)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.5 0.02 260)" tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                      contentStyle={{
                        background: "oklch(0.995 0.001 247)",
                        border: "1px solid oklch(0.91 0.01 247)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="oklch(0.62 0.19 145)" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Task Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {taskStatusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <div className="flex justify-center gap-4">
                  {taskStatusData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {item.name} ({item.value})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">Task Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TASKS.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium text-foreground text-sm">{task.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{task.eventTitle}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{task.assignedToName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs capitalize">{task.status.replace("_", " ")}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

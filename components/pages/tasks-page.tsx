"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { TASKS, USERS, EVENTS } from "@/lib/data"
import type { Task, TaskStatus } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, CalendarDays, GripVertical, CheckCircle2, Clock, Circle } from "lucide-react"

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: React.ComponentType<{ className?: string }>; style: string }> = {
  todo: { label: "To Do", icon: Circle, style: "bg-muted text-muted-foreground border-border" },
  in_progress: { label: "In Progress", icon: Clock, style: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", icon: CheckCircle2, style: "bg-success/10 text-success border-success/20" },
}

export function TasksPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>(TASKS)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const canCreate = user?.role === "super_admin" || user?.role === "admin" || user?.role === "team_lead"

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    t.assignedToName.toLowerCase().includes(search.toLowerCase())
  )

  const grouped: Record<TaskStatus, Task[]> = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    in_progress: filteredTasks.filter((t) => t.status === "in_progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
  }

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const assignedUser = USERS.find((u) => u.id === form.get("assignedTo"))
    const newTask: Task = {
      id: `t${Date.now()}`,
      title: form.get("title") as string,
      description: form.get("description") as string,
      eventId: form.get("eventId") as string,
      eventTitle: EVENTS.find((ev) => ev.id === form.get("eventId"))?.title || "",
      assignedTo: form.get("assignedTo") as string,
      assignedToName: assignedUser?.name || "",
      status: "todo",
      deadline: form.get("deadline") as string,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
    setDialogOpen(false)
  }

  const statuses: TaskStatus[] = ["todo", "in_progress", "completed"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Tasks</h1>
          <p className="text-muted-foreground">
            {tasks.length} tasks &middot; {tasks.filter((t) => t.status === "completed").length} completed
          </p>
        </div>
        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>Assign a new task to a team member</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Event</Label>
                    <Select name="eventId" required>
                      <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                      <SelectContent>
                        {EVENTS.map((ev) => (
                          <SelectItem key={ev.id} value={ev.id}>{ev.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Assign To</Label>
                    <Select name="assignedTo" required>
                      <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                      <SelectContent>
                        {USERS.filter((u) => ["volunteer", "team_lead"].includes(u.role)).map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" name="deadline" type="date" required />
                </div>
                <DialogFooter>
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/30"
        />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {statuses.map((status) => {
          const config = STATUS_CONFIG[status]
          const Icon = config.icon
          return (
            <div key={status} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {grouped[status].length}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                {grouped[status].length === 0 ? (
                  <Card className="border-dashed border-border/50">
                    <CardContent className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                      No tasks
                    </CardContent>
                  </Card>
                ) : (
                  grouped[status].map((task) => (
                    <Card key={task.id} className="group border-border/50 hover:border-primary/20 transition-colors cursor-default">
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-foreground leading-snug">{task.title}</p>
                            <GripVertical className="h-4 w-4 text-muted-foreground/30 shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            <span>{task.deadline}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                                {task.assignedToName.split(" ").map((n) => n[0]).join("")}
                              </div>
                              <span className="text-xs text-muted-foreground">{task.assignedToName.split(" ")[0]}</span>
                            </div>
                            <Select
                              value={task.status}
                              onValueChange={(val) => handleStatusChange(task.id, val as TaskStatus)}
                            >
                              <SelectTrigger className="h-6 w-auto text-[10px] px-2 border-0 bg-secondary/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Badge variant="outline" className="w-fit text-[10px]">{task.eventTitle}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

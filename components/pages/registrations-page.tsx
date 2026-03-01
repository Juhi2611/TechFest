"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { REGISTRATIONS } from "@/lib/data"
import type { Registration, RegistrationStatus } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, CheckCircle2, XCircle, Eye, Users } from "lucide-react"

const STATUS_STYLES: Record<RegistrationStatus, string> = {
  pending: "bg-warning/10 text-warning-foreground border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RegistrationsPage() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState<Registration[]>(REGISTRATIONS)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)

  const canApprove =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "faculty_coordinator" ||
    user?.role === "club_coordinator"

  const filtered = registrations.filter((r) => {
    const matchSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "all" || r.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleStatusChange = (id: string, status: RegistrationStatus) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  const stats = [
    { label: "Total", value: registrations.length, color: "text-foreground" },
    { label: "Pending", value: registrations.filter((r) => r.status === "pending").length, color: "text-warning-foreground" },
    { label: "Approved", value: registrations.filter((r) => r.status === "approved").length, color: "text-success" },
    { label: "Rejected", value: registrations.filter((r) => r.status === "rejected").length, color: "text-destructive" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Registrations</h1>
        <p className="text-muted-foreground">Manage event registrations and approvals</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/30"
          />
        </div>
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No registrations found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{reg.userName}</span>
                      <span className="text-xs text-muted-foreground">{reg.userEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground">{reg.eventTitle}</TableCell>
                  <TableCell>
                    {reg.teamName ? (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-sm">{reg.teamName}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Individual</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_STYLES[reg.status]}>
                      {reg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(reg.registeredAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedReg(reg)}>
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        {canApprove && reg.status === "pending" && (
                          <>
                            <DropdownMenuItem onClick={() => handleStatusChange(reg.id, "approved")}>
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-success" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(reg.id, "rejected")}>
                              <XCircle className="mr-2 h-3.5 w-3.5 text-destructive" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>
              {selectedReg?.userName} &middot; {selectedReg?.eventTitle}
            </DialogDescription>
          </DialogHeader>
          {selectedReg && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">{selectedReg.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{selectedReg.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Event</p>
                  <p className="text-sm font-medium text-foreground">{selectedReg.eventTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={STATUS_STYLES[selectedReg.status]}>
                    {selectedReg.status}
                  </Badge>
                </div>
                {selectedReg.teamName && (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Team Name</p>
                      <p className="text-sm font-medium text-foreground">{selectedReg.teamName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Members</p>
                      <p className="text-sm text-foreground">{selectedReg.teamMembers?.join(", ")}</p>
                    </div>
                  </>
                )}
                {selectedReg.referralCode && (
                  <div>
                    <p className="text-xs text-muted-foreground">Referral Code</p>
                    <Badge variant="secondary">{selectedReg.referralCode}</Badge>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="text-sm text-foreground">
                    {new Date(selectedReg.registeredAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {canApprove && selectedReg.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => { handleStatusChange(selectedReg.id, "approved"); setSelectedReg(null) }}
                    className="flex-1"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { handleStatusChange(selectedReg.id, "rejected"); setSelectedReg(null) }}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

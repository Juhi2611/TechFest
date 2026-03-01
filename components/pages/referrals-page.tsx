"use client"

import { useAuth } from "@/lib/auth-context"
import { REGISTRATIONS } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Copy, Link2, Users, TrendingUp, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export function ReferralsPage() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralCode = user?.referralCode || "N/A"
  const referredRegs = REGISTRATIONS.filter((r) => r.referralCode === referralCode)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Referrals</h1>
        <p className="text-muted-foreground">Track your referral performance</p>
      </div>

      {/* Referral Code */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Your Referral Code</CardTitle>
          <CardDescription>Share this code to track registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 max-w-sm">
            <Input value={referralCode} readOnly className="font-mono text-lg font-bold bg-secondary/30 text-foreground" />
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-xl font-bold text-foreground">{referredRegs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-xl font-bold text-foreground">
                  {referredRegs.filter((r) => r.status === "approved").length}
                </p>
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
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-xl font-bold text-foreground">
                  {referredRegs.length > 0
                    ? `${Math.round((referredRegs.filter((r) => r.status === "approved").length / referredRegs.length) * 100)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referred Registrations */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">Referred Registrations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referredRegs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No referrals yet. Share your code!
                  </TableCell>
                </TableRow>
              ) : (
                referredRegs.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium text-foreground">{reg.userName}</TableCell>
                    <TableCell className="text-muted-foreground">{reg.eventTitle}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        reg.status === "approved"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning-foreground border-warning/20"
                      }>
                        {reg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(reg.registeredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

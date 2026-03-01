"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { USERS } from "@/lib/data"
import { ROLE_LABELS, type UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Eye, EyeOff, ChevronDown } from "lucide-react"

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [showQuickAccess, setShowQuickAccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!login(email, password)) {
      setError("Invalid credentials. Use quick access below or try a valid email.")
    }
  }

  const handleQuickLogin = (role: UserRole) => {
    const user = USERS.find((u) => u.role === role)
    if (user) {
      login(user.email, "demo")
    }
  }

  const quickAccessRoles: UserRole[] = [
    "super_admin",
    "admin",
    "faculty_coordinator",
    "club_coordinator",
    "team_lead",
    "volunteer",
    "campus_ambassador",
  ]

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Rocket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">TechFest</span>
          </div>
          <p className="text-sm text-muted-foreground">Management System</p>
        </div>

        <Card className="w-full border-border/50 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">Sign in</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@techfest.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm text-destructive" role="alert">{error}</p>
              )}
              <Button type="submit" className="w-full mt-2">
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowQuickAccess(!showQuickAccess)}
                className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
              >
                <span>Quick access (demo)</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showQuickAccess ? "rotate-180" : ""}`} />
              </button>
              {showQuickAccess && (
                <div className="mt-2 flex flex-col gap-1.5">
                  {quickAccessRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleQuickLogin(role)}
                      className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-foreground hover:bg-secondary/50 transition-colors text-left"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-medium text-primary">
                        {ROLE_LABELS[role].charAt(0)}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">{ROLE_LABELS[role]}</span>
                        <span className="text-xs text-muted-foreground">
                          {USERS.find((u) => u.role === role)?.email}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

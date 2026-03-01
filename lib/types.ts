export type UserRole =
  | "super_admin"
  | "admin"
  | "faculty_coordinator"
  | "club_coordinator"
  | "team_lead"
  | "volunteer"
  | "campus_ambassador"

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  faculty_coordinator: "Faculty Coordinator",
  club_coordinator: "Club Coordinator",
  team_lead: "Team Lead",
  volunteer: "Volunteer",
  campus_ambassador: "Campus Ambassador",
}

export type TaskStatus = "todo" | "in_progress" | "completed"
export type RegistrationStatus = "pending" | "approved" | "rejected"
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  referralCode?: string
  createdAt: string
}

export interface TechEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  category: string
  status: EventStatus
  maxRegistrations: number
  currentRegistrations: number
  coordinatorId: string
  createdBy: string
  createdAt: string
}

export interface Registration {
  id: string
  eventId: string
  eventTitle: string
  userId: string
  userName: string
  userEmail: string
  teamName?: string
  teamMembers?: string[]
  status: RegistrationStatus
  registeredAt: string
  referralCode?: string
}

export interface Task {
  id: string
  title: string
  description: string
  eventId: string
  eventTitle: string
  assignedTo: string
  assignedToName: string
  status: TaskStatus
  deadline: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: string
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
}

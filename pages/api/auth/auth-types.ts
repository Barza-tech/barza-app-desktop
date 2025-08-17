// auth-types.ts
interface data {
  name: string
  phone?: string
  userType: []
}

export interface User {
  id: string
  name: data["name"]
  phone: data["phone"]
  email: string
  fullName?: string
  avatarUrl?: string
  user_Type?: data["userType"] extends string ? data["userType"] : "client" | "professional"
  createdAt?: string
  updatedAt?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

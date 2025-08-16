// auth-types.ts

export interface User {
  id: string
  name: string
  phone: string
  email: string
  fullName?: string
  avatarUrl?: string
  user_Type?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

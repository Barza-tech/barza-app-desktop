"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Scissors } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

const initialFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: "client" as "client" | "professional",
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let endpoint: string
      let payload: any

      if (mode === "login") {
        endpoint = "/api/auth/login"
        payload = { email: formData.email, password: formData.password }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({ title: t.error, description: t.passwordsDoNotMatch, variant: "destructive" })
          setLoading(false)
          return
        }

        endpoint = "/api/auth/register"
        payload = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType: formData.userType,
        }
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      if (mode === "login") {
        toast({ title: t.loginSuccessful, description: t.welcomeBackToBarza })
        router.replace(
          data.user.user_metadata.user_type === "professional"
            ? "/professional/dashboard"
            : "/client/dashboard"
        )
      } else {
        toast({
          title: t.registrationSuccessful,
          description: "Please check your email to verify your account.",
          duration: 6000,
        })
        setFormData(initialFormData)
        onModeChange("login")
      }
    } catch (error: any) {
      toast({ title: t.error, description: error.message || t.somethingWentWrong, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (newMode: "login" | "register") => {
    setFormData(initialFormData)
    onModeChange(newMode)
  }

  const handleModalClose = () => {
    setFormData(initialFormData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 barza-gradient rounded-2xl flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {mode === "login" ? t.welcomeBack : t.joinBarza}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {mode === "login" ? "Sign in to your Barza account " : "Create your Barza account"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => handleTabChange(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.login}</TabsTrigger>
            <TabsTrigger value="register">{t.register}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full barza-gradient text-white" disabled={loading}>
                {loading ? t.signingIn : t.signIn}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">{t.iAmA}</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value: "client" | "professional") =>
                    setFormData({ ...formData, userType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">{t.client}</SelectItem>
                    <SelectItem value="professional">{t.professionalBarberBeauty}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full barza-gradient text-white" disabled={loading}>
                {loading ? t.creatingAccount : t.createAccount}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}


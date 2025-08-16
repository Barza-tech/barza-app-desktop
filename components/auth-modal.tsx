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

// Estado inicial do formulário para facilitar o reset
const initialFormData = {
  name: "",
  email: "",
  phone: "",
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
      let payload: any
      let endpoint: string

      if (mode === "login") {
        payload = { email: formData.email, password: formData.password }
        endpoint = "https://vuqlvieuqimcaywcxteg.supabase.co/auth/v1/token?grant_type=password"
      } else { // Modo 'register'
        if (formData.password !== formData.confirmPassword) {
          toast({ title: t.error, description: t.passwordsDoNotMatch, variant: "destructive" })
          setLoading(false)
          return
        }
        const registrationData: { [key: string]: any } = {
          name: formData.name,
          user_type: formData.userType,
        }
        if (formData.phone) {
          registrationData.phone = formData.phone
        }
        payload = { email: formData.email, password: formData.password, data: registrationData }
        endpoint = "https://vuqlvieuqimcaywcxteg.supabase.co/auth/v1/signup"
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error_description || data.msg || "Something went wrong")

      if (mode === "login") {
        toast({ title: t.loginSuccessful, description: t.welcomeBackToBarza })
        
        const isLocalhost = window.location.hostname === "localhost"
        document.cookie = `access_token=${data.access_token}; path=/; max-age=${
          60 * 60 * 24
        }; ${isLocalhost ? "" : "secure;"} samesite=lax`
        localStorage.setItem("barza-user", JSON.stringify(data.user))
        
        router.replace(
          data.user.user_metadata.user_type === "professional"
            ? "/professional/dashboard"
            : "/client/dashboard"
        )
      } else { // Lógica após o sucesso do registo
        // ▼▼▼ NOVA LÓGICA DE REGISTO ▼▼▼
        toast({
          title: t.registrationSuccessful,
          description: "Please check your email to verify your account.", // Mensagem clara
          duration: 6000, // Aumenta a duração para dar tempo de ler
        })
        setFormData(initialFormData) // Limpa os campos do formulário
        onModeChange("login") // Muda para a aba de login para conveniência
        // Não redireciona, o utilizador permanece no modal
        // onClose() // Opcional: se quiser fechar o modal, descomente esta linha
        // ▲▲▲ FIM DA NOVA LÓGICA ▲▲▲
      }
    } catch (error: any) {
      toast({ title: t.error, description: error.message || t.somethingWentWrong, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }
  
  // Limpa o formulário ao fechar o modal ou trocar de aba
  const handleTabChange = (newMode: "login" | "register") => {
    setFormData(initialFormData);
    onModeChange(newMode);
  }
  
  const handleModalClose = () => {
    setFormData(initialFormData);
    onClose();
  }

  return (
    // O JSX (return) permanece exatamente o mesmo, sem alterações.
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
            {mode === "login"
              ? "Sign in to your Barza account "
              : "Create your Barza account"}
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
                <Label htmlFor="name">{t.fullName}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
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
                <Label htmlFor="phone">{t.phoneNumber} (Opcional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
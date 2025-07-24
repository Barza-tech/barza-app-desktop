"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Scissors, Mail, Phone } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "client" as "client" | "professional",
  })
  const [verificationStep, setVerificationStep] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email")
  const [loading, setLoading] = useState(false)

  const { login, register, verifyCode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        const success = await login(formData.email, formData.password)
        if (success) {
          toast({
            title: t.loginSuccessful,
            description: t.welcomeBackToBarza,
          })

          // Redirect based on user type
          if (formData.email.includes("barber")) {
            router.replace("/professional/dashboard")
          } else {
            router.replace("/client/dashboard")
          }
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: t.error,
            description: t.passwordsDoNotMatch,
            variant: "destructive",
          })
          return
        }

        const success = await register(formData)
        if (success) {
          setVerificationStep(true)
          toast({
            title: t.registrationSuccessful,
            description: `${t.verificationCodeSent} ${verificationMethod}`,
          })
        }
      }
    } catch (error) {
      toast({
        title: t.error,
        description: t.somethingWentWrong,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await verifyCode(verificationCode)
      if (success) {
        toast({
          title: t.verificationSuccessful,
          description: t.accountVerified,
        })

        // Redirect based on user type
        if (formData.userType === "professional") {
          router.replace("/professional/dashboard")
        } else {
          router.replace("/client/dashboard")
        }
      } else {
        toast({
          title: t.invalidCode,
          description: t.checkVerificationCode,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t.error,
        description: t.verificationFailed,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: "client",
    })
    setVerificationStep(false)
    setVerificationCode("")
  }

  if (verificationStep) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 barza-gradient rounded-2xl flex items-center justify-center">
                <Scissors className="w-8 h-8 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">{t.verifyAccount}</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Enter the verification code sent to your email or phone to complete registration.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleVerification} className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                {t.verificationCodeSent} {verificationMethod}
              </p>
              <p className="text-sm text-gray-500">
                {verificationMethod === "email" ? formData.email : formData.phone}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">{t.verificationCode}</Label>
              <Input
                id="code"
                type="text"
                placeholder={t.enterSixDigitCode}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full barza-gradient text-white"
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? t.verifying : t.verifyAccount2}
            </Button>

            <div className="text-center">
              <Button type="button" variant="ghost" onClick={() => setVerificationStep(false)}>
                {t.backToRegistration}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 barza-gradient rounded-2xl flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{mode === "login" ? t.welcomeBack : t.joinBarza}</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {mode === "login"
              ? "Sign in to your Barza account to find and book professional services."
              : "Create your Barza account to start booking professional barber and beauty services."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(value) => onModeChange(value as "login" | "register")}>
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
                <Label htmlFor="phone">{t.phoneNumber}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">{t.iAmA}</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value: "client" | "professional") => setFormData({ ...formData, userType: value })}
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

              <div className="space-y-2">
                <Label>{t.verificationMethod}</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={verificationMethod === "email" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVerificationMethod("email")}
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={verificationMethod === "phone" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setVerificationMethod("phone")}
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                </div>
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

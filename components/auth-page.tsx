"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Scissors, Mail, Phone, Eye, EyeOff } from "lucide-react"

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { user, login, register, verifyCode } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if user is already logged in and verified
  useEffect(() => {
    if (user && user.isVerified) {
      if (user.userType === "client") {
        router.push("/client/dashboard")
      } else if (user.userType === "professional") {
        router.push("/professional/dashboard")
      } else if (user.userType === "admin") {
        router.push("/admin/dashboard")
      }
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (activeTab === "login") {
        const success = await login(formData.email, formData.password)
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome back to Barza!",
          })
          // Redirect will happen automatically via useEffect
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          })
          return
        }

        if (formData.password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          })
          return
        }

        const success = await register(formData)
        if (success) {
          setVerificationStep(true)
          toast({
            title: "Registration successful",
            description: `Verification code sent to your ${verificationMethod}`,
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
          title: "Verification successful",
          description: "Your account has been verified!",
        })
        setVerificationStep(false)
        // Redirect will happen automatically via useEffect
      } else {
        toast({
          title: "Invalid code",
          description: "Please check your verification code and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
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
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register")
    resetForm()
  }

  if (verificationStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 barza-gradient rounded-3xl flex items-center justify-center">
                <Scissors className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Verify Your Account</CardTitle>
              <p className="text-gray-600 mt-2">We sent a verification code to your {verificationMethod}</p>
              <p className="text-sm text-gray-500">
                {verificationMethod === "email" ? formData.email : formData.phone}
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-lg tracking-widest font-mono"
                  required
                />
                <p className="text-xs text-gray-500 text-center">Use code: 123456 for demo</p>
              </div>

              <Button
                type="submit"
                className="w-full barza-gradient text-white py-3"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Account"}
              </Button>

              <div className="text-center space-y-2">
                <Button type="button" variant="ghost" onClick={() => setVerificationStep(false)} className="text-sm">
                  Back to Registration
                </Button>
                <div className="text-xs text-gray-500">
                  Didn't receive the code?
                  <Button variant="link" className="text-xs p-0 ml-1 h-auto">
                    Resend
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 barza-gradient rounded-3xl flex items-center justify-center">
              <Scissors className="w-10 h-10 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold">Welcome to Barza</CardTitle>
            <p className="text-gray-600">Find your perfect barber or grow your business</p>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <Button variant="link" className="text-sm p-0 h-auto">
                    Forgot password?
                  </Button>
                </div>

                <Button type="submit" className="w-full barza-gradient text-white py-3" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Demo: Use any email (add "barber" for professional account)
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
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
                  <Label htmlFor="email">Email Address</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
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
                  <Label htmlFor="userType">I am a</Label>
                  <Select
                    value={formData.userType}
                    onValueChange={(value: "client" | "professional") => setFormData({ ...formData, userType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client - Looking for services</SelectItem>
                      <SelectItem value="professional">Professional - Barber/Beauty specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Verification Method</Label>
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

                <Button type="submit" className="w-full barza-gradient text-white py-3" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

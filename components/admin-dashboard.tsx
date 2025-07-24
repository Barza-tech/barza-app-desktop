"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  LogOut,
  Scissors,
  Download,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationCenter } from "@/components/notification-center"
import { notificationManager } from "@/lib/notifications"

interface CommissionPayment {
  id: string
  professionalName: string
  clientName: string
  service: string
  amount: number
  commission: number
  paymentMethod: string
  transactionId: string
  receiptUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  notes?: string
}

interface PlatformStats {
  totalUsers: number
  totalProfessionals: number
  totalBookings: number
  totalRevenue: number
  pendingCommissions: number
}

const mockCommissions: CommissionPayment[] = [
  {
    id: "1",
    professionalName: "Carlos Silva",
    clientName: "John Smith",
    service: "Haircut + Beard Trim",
    amount: 35,
    commission: 5.25,
    paymentMethod: "Bank Transfer",
    transactionId: "TXN123456789",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "pending",
    submittedAt: "2024-01-25T10:30:00Z",
    notes: "Payment made via online banking",
  },
  {
    id: "2",
    professionalName: "Maria Santos",
    clientName: "Jane Doe",
    service: "Hair Styling",
    amount: 45,
    commission: 6.75,
    paymentMethod: "PayPal",
    transactionId: "PP987654321",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "approved",
    submittedAt: "2024-01-24T14:15:00Z",
  },
  {
    id: "3",
    professionalName: "João Oliveira",
    clientName: "Mike Johnson",
    service: "Haircut",
    amount: 25,
    commission: 3.75,
    paymentMethod: "Bank Transfer",
    transactionId: "TXN555666777",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "rejected",
    submittedAt: "2024-01-23T16:45:00Z",
    notes: "Invalid transaction ID provided",
  },
]

const mockStats: PlatformStats = {
  totalUsers: 1247,
  totalProfessionals: 89,
  totalBookings: 3456,
  totalRevenue: 87650,
  pendingCommissions: 15,
}

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const [commissions, setCommissions] = useState(mockCommissions)
  const [selectedCommission, setSelectedCommission] = useState<CommissionPayment | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  // Initialize notification manager with current language
  useEffect(() => {
    notificationManager.setLanguage(language)
  }, [language])

  const handleApproveCommission = (commissionId: string) => {
    setCommissions((prev) =>
      prev.map((commission) =>
        commission.id === commissionId ? { ...commission, status: "approved" as const } : commission,
      ),
    )
    toast({
      title: t.commissionApproved,
      description: t.professionalNotified,
    })
  }

  const handleRejectCommission = (commissionId: string) => {
    setCommissions((prev) =>
      prev.map((commission) =>
        commission.id === commissionId ? { ...commission, status: "rejected" as const } : commission,
      ),
    )
    toast({
      title: t.commissionRejected,
      description: t.professionalNotified,
    })
  }

  const handleViewReceipt = (commission: CommissionPayment) => {
    setSelectedCommission(commission)
    setShowReceiptModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return t.approved
      case "rejected":
        return t.rejected
      case "pending":
        return t.pending
      default:
        return status
    }
  }

  const pendingCommissions = commissions.filter((c) => c.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 barza-gradient rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barza Admin</h1>
                <p className="text-sm text-gray-500">{t.platformManagement}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <LanguageSwitcher />
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.totalUsers}</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.professionals}</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalProfessionals}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.totalBookings}</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.totalRevenue}</p>
                  <p className="text-2xl font-bold text-gray-900">${mockStats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t.pendingReviews}</p>
                  <p className="text-2xl font-bold text-red-600">{pendingCommissions.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="commissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="commissions">Commission Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>{t.commissionPaymentReviews}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commissions.map((commission) => (
                    <div key={commission.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{commission.professionalName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{commission.professionalName}</h4>
                              <p className="text-sm text-gray-600">
                                Service for {commission.clientName} • {commission.service}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Service Amount:</span>
                              <p className="font-medium">${commission.amount}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Commission:</span>
                              <p className="font-medium text-orange-600">${commission.commission}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Payment Method:</span>
                              <p className="font-medium">{commission.paymentMethod}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Transaction ID:</span>
                              <p className="font-medium">{commission.transactionId}</p>
                            </div>
                          </div>

                          {commission.notes && (
                            <div className="text-sm">
                              <span className="text-gray-600">Notes:</span>
                              <p className="text-gray-800">{commission.notes}</p>
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Submitted: {new Date(commission.submittedAt).toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <Badge className={getStatusColor(commission.status)}>
                            {getStatusText(commission.status)}
                          </Badge>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewReceipt(commission)}>
                              <Eye className="w-4 h-4 mr-1" />
                              {t.viewReceipt}
                            </Button>

                            {commission.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectCommission(commission.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  {t.reject}
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveCommission(commission.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {t.approve}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.platformReports}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    {t.downloadUserReport}
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    {t.downloadRevenueReport}
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    {t.downloadCommissionReport}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.paymentReceiptTitle}</DialogTitle>
            <DialogDescription>
              Review the payment receipt submitted by the professional for commission payment.
            </DialogDescription>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={selectedCommission.receiptUrl || "/placeholder.svg"}
                  alt="Payment Receipt"
                  className="max-w-full h-auto rounded-lg border"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional:</span>
                  <span className="font-medium">{selectedCommission.professionalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{selectedCommission.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${selectedCommission.commission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium">{selectedCommission.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

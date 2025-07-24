"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Scissors,
  LogOut,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface PaymentValidation {
  id: string
  professionalName: string
  clientName: string
  service: string
  amount: number
  commission: number
  date: string
  receiptUrl: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

const mockPayments: PaymentValidation[] = [
  {
    id: "1",
    professionalName: "Carlos Silva",
    clientName: "John Smith",
    service: "Haircut + Beard Trim",
    amount: 35,
    commission: 5.25,
    date: "2024-01-24",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "pending",
    submittedAt: "2024-01-25 10:30",
  },
  {
    id: "2",
    professionalName: "Maria Santos",
    clientName: "Mike Johnson",
    service: "Hair Styling",
    amount: 45,
    commission: 6.75,
    date: "2024-01-23",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "pending",
    submittedAt: "2024-01-24 15:45",
  },
  {
    id: "3",
    professionalName: "João Oliveira",
    clientName: "David Wilson",
    service: "Full Service",
    amount: 50,
    commission: 7.5,
    date: "2024-01-22",
    receiptUrl: "/placeholder.svg?height=400&width=300",
    status: "approved",
    submittedAt: "2024-01-23 09:15",
  },
]

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [payments, setPayments] = useState(mockPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPayment, setSelectedPayment] = useState<PaymentValidation | null>(null)

  const handleApprovePayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "approved" as const } : payment)),
    )
    toast({
      title: "Payment approved",
      description: "The professional has been notified",
    })
  }

  const handleRejectPayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((payment) => (payment.id === paymentId ? { ...payment, status: "rejected" as const } : payment)),
    )
    toast({
      title: "Payment rejected",
      description: "The professional has been notified to resubmit",
    })
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.professionalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pendingPayments = payments.filter((p) => p.status === "pending")
  const totalCommissions = payments.reduce((sum, p) => sum + p.commission, 0)
  const approvedCommissions = payments.filter((p) => p.status === "approved").reduce((sum, p) => sum + p.commission, 0)

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
                <p className="text-sm text-gray-500">Payment Validation Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Validations</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingPayments.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Commissions</p>
                  <p className="text-2xl font-bold text-gray-900">${totalCommissions.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved This Month</p>
                  <p className="text-2xl font-bold text-gray-900">${approvedCommissions.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Professionals</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="validations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="validations">Payment Validations</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="validations" className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Payment Validations */}
            <Card>
              <CardHeader>
                <CardTitle>Commission Payment Validations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{payment.professionalName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{payment.professionalName}</h4>
                              <p className="text-sm text-gray-600">Service for {payment.clientName}</p>
                            </div>
                            <Badge
                              className={
                                payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : payment.status === "approved"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Service:</span>
                              <p>{payment.service}</p>
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span>
                              <p>${payment.amount}</p>
                            </div>
                            <div>
                              <span className="font-medium">Commission:</span>
                              <p className="text-orange-600 font-semibold">${payment.commission}</p>
                            </div>
                            <div>
                              <span className="font-medium">Submitted:</span>
                              <p>{payment.submittedAt}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Receipt
                          </Button>
                          {payment.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleRejectPayment(payment.id)}>
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprovePayment(payment.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            </>
                          )}
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
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Financial Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Coming Soon</h3>
                  <p className="text-gray-600">Detailed financial reports and analytics will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management Coming Soon</h3>
                  <p className="text-gray-600">User management tools will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Receipt Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Receipt</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(null)}>
                ×
              </Button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Professional:</strong> {selectedPayment.professionalName}
                </p>
                <p>
                  <strong>Commission:</strong> ${selectedPayment.commission}
                </p>
                <p>
                  <strong>Date:</strong> {selectedPayment.date}
                </p>
              </div>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={selectedPayment.receiptUrl || "/placeholder.svg"}
                  alt="Payment Receipt"
                  className="w-full h-64 object-cover rounded"
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleRejectPayment(selectedPayment.id)} className="flex-1">
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprovePayment(selectedPayment.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

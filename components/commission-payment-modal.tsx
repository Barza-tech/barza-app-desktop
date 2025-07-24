"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

interface BookingRequest {
  id: string
  clientName: string
  service: string
  date: string
  time: string
  price: number
  status: "pending" | "accepted" | "completed"
  commission: number
}

interface CommissionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  booking: BookingRequest | null
}

export function CommissionPaymentModal({ isOpen, onClose, booking }: CommissionPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useLanguage()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock payment submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: t.paymentSubmitted,
        description: t.commissionSubmittedReview,
      })

      onClose()
      resetForm()
    } catch (error) {
      toast({
        title: t.error,
        description: t.failedSubmitPayment,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setPaymentMethod("")
    setTransactionId("")
    setReceipt(null)
    setNotes("")
  }

  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.payCommission}</DialogTitle>
          <DialogDescription>
            Submit your commission payment details and receipt for this completed service.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking Info */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t.client}:</span>
              <span className="font-medium">{booking.clientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t.service}:</span>
              <span className="font-medium">{booking.service}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t.date}:</span>
              <span className="font-medium">{booking.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t.serviceAmount}</span>
              <span className="font-medium">${booking.price}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-medium text-orange-600">{t.commissionDue}:</span>
              <span className="text-lg font-bold text-orange-600">${booking.commission}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">{t.paymentMethod}</Label>
              <Input
                id="paymentMethod"
                type="text"
                placeholder="e.g., Bank Transfer, PayPal, etc."
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              />
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <Label htmlFor="transactionId">{t.transactionId}</Label>
              <Input
                id="transactionId"
                type="text"
                placeholder="Enter transaction reference"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
            </div>

            {/* Receipt Upload */}
            <div className="space-y-2">
              <Label htmlFor="receipt">{t.paymentReceipt}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label htmlFor="receipt" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">{receipt ? receipt.name : t.clickUploadReceipt}</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (max 5MB)</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t.additionalNotes} (Optional)</Label>
              <Textarea
                id="notes"
                placeholder={t.additionalInfo}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                {t.cancel}
              </Button>
              <Button type="submit" className="flex-1 barza-gradient text-white" disabled={loading}>
                {loading ? t.submitting : t.submitPayment}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

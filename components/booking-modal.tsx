"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

interface Professional {
  id: string
  name: string
  rating: number
  distance: string
  services: string[]
  price: number
  isAvailable: boolean
  location: { lat: number; lng: number }
  completedServices: number
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  professional: Professional | null
}

export function BookingModal({ isOpen, onClose, professional }: BookingModalProps) {
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [attendanceType, setAttendanceType] = useState<"domicilio" | "local">("local")
  const { toast } = useToast()
  const { t } = useLanguage()

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
  ]

  // Define price logic: domicilio is 20% more expensive
  const getPrice = () => {
    if (attendanceType === "domicilio") {
      return (professional?.price ?? 0) * 1.2
    }
    return professional?.price ?? 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock booking submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: t.bookingRequestSent,
        description: t.bookingApprovalSent.replace("{name}", professional?.name || ""),
      })

      onClose()
      resetForm()
    } catch (error) {
      toast({
        title: t.error,
        description: t.failedSendBooking,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedService("")
    setSelectedDate("")
    setSelectedTime("")
    setNotes("")
    setAttendanceType("local")
  }

  if (!professional) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t.bookWith} {professional.name}
          </DialogTitle>
          <DialogDescription>
            Select your preferred service, date and time to book an appointment with this professional.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Professional Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-800 font-semibold">{professional.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{professional.name}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{professional.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{professional.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{professional.completedServices}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Attendance Type Selection */}
            <div className="space-y-2">
              <Label>{"Tipo de atendimento"}</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={attendanceType === "local" ? "default" : "outline"}
                  onClick={() => setAttendanceType("local")}
                  className={attendanceType === "local" ? "barza-gradient text-white" : ""}
                >
                  No local do profissional
                </Button>
                <Button
                  type="button"
                  variant={attendanceType === "domicilio" ? "default" : "outline"}
                  onClick={() => setAttendanceType("domicilio")}
                  className={attendanceType === "domicilio" ? "barza-gradient text-white" : ""}
                >
                  Ao domicílio (+20%)
                </Button>
              </div>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="service">{t.service}</Label>
              <Select value={selectedService} onValueChange={setSelectedService} required>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectService} />
                </SelectTrigger>
                <SelectContent>
                  {professional.services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date">{t.date}</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time">{t.time}</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime} required>
                <SelectTrigger>
                  <SelectValue placeholder={t.selectTime} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t.additionalNotes} (Optional)</Label>
              <Textarea
                id="notes"
                placeholder={t.specialRequests}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Price */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">{t.estimatedPrice}:</span>
              <span className="text-lg font-semibold">
                ${getPrice().toFixed(2)}
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                {t.cancel}
              </Button>
              <Button type="submit" className="flex-1 barza-gradient text-white" disabled={loading}>
                {loading ? t.sending : t.sendRequest}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

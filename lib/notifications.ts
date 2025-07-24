import type { Language } from "./i18n"

type NotificationCallback = (notification: any) => void

class NotificationManager {
  private callbacks: NotificationCallback[] = []
  private language: Language = "en"

  addNotificationCallback(callback: NotificationCallback) {
    this.callbacks.push(callback)
  }

  removeNotificationCallback(callback: NotificationCallback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
  }

  setLanguage(language: Language) {
    this.language = language
  }

  private notify(notification: any) {
    this.callbacks.forEach((callback) => {
      try {
        callback(notification)
      } catch (error) {
        console.error("Error in notification callback:", error)
      }
    })
  }

  // Notification methods for different events
  notifyBookingRequest(clientName: string, service: string, time: string) {
    const messages = {
      en: `${clientName} requested ${service} at ${time}`,
      pt: `${clientName} solicitou ${service} às ${time}`,
      fr: `${clientName} a demandé ${service} à ${time}`,
    }

    this.notify({
      id: Date.now().toString(),
      type: "booking",
      title:
        this.language === "en"
          ? "New Booking Request"
          : this.language === "pt"
            ? "Nova Solicitação de Reserva"
            : "Nouvelle Demande de Réservation",
      message: messages[this.language],
      timestamp: new Date(),
      read: false,
      priority: "high",
    })
  }

  notifyBookingAccepted(professionalName: string, service: string, time: string) {
    const messages = {
      en: `${professionalName} accepted your ${service} booking for ${time}`,
      pt: `${professionalName} aceitou a sua reserva de ${service} para ${time}`,
      fr: `${professionalName} a accepté votre réservation ${service} pour ${time}`,
    }

    this.notify({
      id: Date.now().toString(),
      type: "booking",
      title:
        this.language === "en"
          ? "Booking Confirmed"
          : this.language === "pt"
            ? "Reserva Confirmada"
            : "Réservation Confirmée",
      message: messages[this.language],
      timestamp: new Date(),
      read: false,
      priority: "high",
    })
  }

  notifyCommissionDue(amount: number) {
    const messages = {
      en: `You have a pending commission payment of $${amount}`,
      pt: `Tem um pagamento de comissão pendente de $${amount}`,
      fr: `Vous avez un paiement de commission en attente de $${amount}`,
    }

    this.notify({
      id: Date.now().toString(),
      type: "commission",
      title:
        this.language === "en"
          ? "Commission Payment Due"
          : this.language === "pt"
            ? "Pagamento de Comissão Devido"
            : "Paiement de Commission Dû",
      message: messages[this.language],
      timestamp: new Date(),
      read: false,
      priority: "medium",
    })
  }

  notifyLocationUpdate() {
    const messages = {
      en: "Your location has been updated successfully",
      pt: "A sua localização foi atualizada com sucesso",
      fr: "Votre emplacement a été mis à jour avec succès",
    }

    this.notify({
      id: Date.now().toString(),
      type: "system",
      title:
        this.language === "en"
          ? "Location Updated"
          : this.language === "pt"
            ? "Localização Atualizada"
            : "Emplacement Mis à Jour",
      message: messages[this.language],
      timestamp: new Date(),
      read: false,
      priority: "low",
    })
  }
}

export const notificationManager = new NotificationManager()

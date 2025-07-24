"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, getBrowserLanguage, getTranslations, type Translations } from "@/lib/i18n"
import { notificationManager } from "@/lib/notifications"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Check for stored language preference first
    const storedLanguage = localStorage.getItem("barza-language") as Language
    if (storedLanguage && ["en", "pt", "fr"].includes(storedLanguage)) {
      setLanguage(storedLanguage)
      notificationManager.setLanguage(storedLanguage)
    } else {
      // Get browser language on client side
      const browserLang = getBrowserLanguage()
      setLanguage(browserLang)
      notificationManager.setLanguage(browserLang)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("barza-language", newLanguage)
    notificationManager.setLanguage(newLanguage)
  }

  const translations = getTranslations(language)

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

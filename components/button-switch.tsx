"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface Props {
  profiles?: ("client" | "professional")[] // deixa opcional
  activeProfile: "client" | "professional"
  addProfile: (profile: "client" | "professional") => void
  switchProfile: (profile: "client" | "professional") => void
}

export function ProfileSwitcherButton({
  profiles = [], 
  activeProfile,
  addProfile,
  switchProfile,
}: Props) {
  const onlyOne = profiles.length === 1
  const label = onlyOne
    ? "Criar outro perfil"
    : activeProfile === "client"
    ? "Mudar para Profissional"
    : "Mudar para Cliente"

  const handleClick = () => {
    if (onlyOne) {
      const newProfile = profiles[0] === "client" ? "professional" : "client"
      addProfile(newProfile)
    } else {
      const nextProfile = activeProfile === "client" ? "professional" : "client"
      switchProfile(nextProfile)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      {label}
    </Button>
  )
}

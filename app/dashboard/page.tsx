"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { storage, type User } from "../../services/storage"

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await storage.getCurrentUser()
        if (!user || user.role !== "user") {
          router.push("/login")
        } else {
          setCurrentUser(user)
        }
      } catch (error) {
        console.error("Error loading user:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!currentUser) {
    return null
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard de Usuario</h1>
      <div>
        <p>Bienvenido, {currentUser.name}!</p>
        <p>Email: {currentUser.email}</p>
        <p>Cédula: {currentUser.cedula}</p>
        <p>Pantallas: {currentUser.screens}</p>
        <p>Ganancias: ${currentUser.earnings}</p>
      </div>
      <button
        onClick={() => {
          storage.setCurrentUser(null)
          router.push("/login")
        }}
        style={{
          padding: "10px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  )
}


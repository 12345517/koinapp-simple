"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  role: string
  isApproved: boolean
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      } else {
        console.error("Error fetching users")
        router.push("/login")
      }
    } catch (error) {
      console.error("Error:", error)
      router.push("/login")
    }
  }

  const approveUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/users/${userId}/approve`, { method: "POST" })
      if (res.ok) {
        fetchUsers() // Refresh the user list
      } else {
        console.error("Error approving user")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Panel de Administración</h1>

      <h2>Usuarios pendientes de aprobación</h2>
      {users
        .filter((user) => !user.isApproved)
        .map((user) => (
          <div key={user.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
            <p>
              {user.name} ({user.email})
            </p>
            <button
              onClick={() => approveUser(user.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Aprobar
            </button>
          </div>
        ))}

      <h2 style={{ marginTop: "20px" }}>Usuarios aprobados</h2>
      {users
        .filter((user) => user.isApproved)
        .map((user) => (
          <div key={user.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
            <p>
              {user.name} ({user.email})
            </p>
          </div>
        ))}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  )
}


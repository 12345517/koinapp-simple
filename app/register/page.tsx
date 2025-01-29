"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storage, type User } from "../../services/storage"

interface FormData {
  name: string
  cedula: string
  email: string
  password: string
  confirmPassword: string
  paymentPassword: string
  referralCode: string
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cedula: "",
    email: "",
    password: "",
    confirmPassword: "",
    paymentPassword: "",
    referralCode: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      const sponsor = formData.referralCode ? await storage.getUserByEmail(formData.referralCode) : null

      const newUser: Omit<User, "id"> = {
        name: formData.name,
        cedula: formData.cedula,
        email: formData.email,
        password: formData.password,
        paymentPassword: formData.paymentPassword,
        sponsorId: sponsor ? sponsor.id : null,
        role: "user",
        isApproved: false,
        screens: 0,
        earnings: 0,
        referralCode: storage.generateReferralCode(),
      }

      await storage.addUser(newUser)
      alert("Usuario registrado exitosamente. Espere la aprobación del administrador.")
      router.push("/login")
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      setError("Error al registrar usuario. Por favor, intente de nuevo.")
    }
  }

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Registro</h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <input
          type="text"
          name="cedula"
          placeholder="Cédula"
          value={formData.cedula}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña de acceso"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <input
          type="password"
          name="paymentPassword"
          placeholder="Contraseña de pagos"
          value={formData.paymentPassword}
          onChange={handleChange}
          required
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <input
          type="text"
          name="referralCode"
          placeholder="Código de referido (opcional)"
          value={formData.referralCode}
          onChange={handleChange}
          style={{ marginBottom: "10px", padding: "5px" }}
        />
        <button
          type="submit"
          style={{ padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}
        >
          Registrarse ahora
        </button>
      </form>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link href="/login" style={{ color: "#4CAF50", textDecoration: "none" }}>
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  )
}


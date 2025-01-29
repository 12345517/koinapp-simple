import type { NextApiRequest, NextApiResponse } from "next"
import pool from "../../lib/db-server"
import { v4 as uuidv4 } from "uuid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, cedula, email, password, paymentPassword, referralCode } = req.body

    try {
      const client = await pool.connect()
      try {
        // Comprobar si el email ya existe
        const emailCheck = await client.query("SELECT * FROM users WHERE email = $1", [email])
        if (emailCheck.rows.length > 0) {
          return res.status(400).json({ message: "El email ya está registrado" })
        }

        // Comprobar si la cédula ya existe
        const cedulaCheck = await client.query("SELECT * FROM users WHERE cedula = $1", [cedula])
        if (cedulaCheck.rows.length > 0) {
          return res.status(400).json({ message: "La cédula ya está registrada" })
        }

        // Obtener el id del patrocinador si se proporcionó un código de referido
        let sponsorId = null
        if (referralCode) {
          const sponsorQuery = await client.query("SELECT id FROM users WHERE referral_code = $1", [referralCode])
          if (sponsorQuery.rows.length > 0) {
            sponsorId = sponsorQuery.rows[0].id
          }
        }

        // Generar un código de referido único
        const newReferralCode = uuidv4()

        // Insertar el nuevo usuario
        const insertQuery = `
          INSERT INTO users (name, cedula, email, password, payment_password, sponsor_id, role, isapproved, screens, earnings, referral_code)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id
        `
        const values = [name, cedula, email, password, paymentPassword, sponsorId, "user", false, 0, 0, newReferralCode]
        const result = await client.query(insertQuery, values)

        res.status(201).json({ message: "Usuario registrado exitosamente", userId: result.rows[0].id })
      } finally {
        client.release()
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error)
      res.status(500).json({ message: "Error interno del servidor" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}


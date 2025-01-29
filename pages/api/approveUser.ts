import type { NextApiRequest, NextApiResponse } from "next"
import pool from "../../lib/db-server"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId } = req.body

    try {
      const client = await pool.connect()
      try {
        // Verificar si el usuario ya está aprobado
        const checkQuery = "SELECT isapproved FROM users WHERE id = $1"
        const checkResult = await client.query(checkQuery, [userId])

        if (checkResult.rows.length === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" })
        }

        if (checkResult.rows[0].isapproved) {
          return res.status(200).json({ message: "Usuario ya está aprobado" })
        }

        // Aprobar al usuario
        const updateQuery = "UPDATE users SET isapproved = true WHERE id = $1"
        await client.query(updateQuery, [userId])

        res.status(200).json({ message: "Usuario aprobado exitosamente" })
      } finally {
        client.release()
      }
    } catch (error) {
      console.error("Error al aprobar usuario:", error)
      res.status(500).json({ message: "Error interno del servidor" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}


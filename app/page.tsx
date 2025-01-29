"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Home() {
  useEffect(() => {
    console.log("Página principal cargada correctamente")
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Bienvenido a KoinApp</h1>
        <div className="flex justify-center space-x-4">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  )
}


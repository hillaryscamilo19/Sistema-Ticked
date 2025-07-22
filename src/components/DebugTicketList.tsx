"use client"

import { useEffect, useState } from "react"

// Componente de debug para verificar los datos
export default function DebugTicketList() {
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8000/tickets/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        const data = await res.json()
        console.log("Raw API Response:", data)
        console.log("First ticket:", data[0])
        console.log("First ticket ID:", data[0]?.id, "Type:", typeof data[0]?.id)
        setTickets(data)
      } catch (err) {
        console.error("Error:", err)
      }
    }

    fetchTickets()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Debug - Datos de Tickets</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">{JSON.stringify(tickets, null, 2)}</pre>

      <div className="mt-4">
        <h3 className="font-bold">URLs generadas:</h3>
        {tickets.map((ticket, index) => (
          <div key={index} className="mt-2">
            <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
              /dashboard/tickets/{ticket.id} (ID: {ticket.id}, Type: {typeof ticket.id})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

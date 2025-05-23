'use client'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { useParams } from 'react-router-dom'

const estadosDisponibles = [
  'abierto',
  'proceso',
  'espera',
  'revision',
  'completado',
  'cancelado',
]

export default function TicketDetail() {
  const { id } = useParams()
  const [ticket, setTicket] = useState<any>(null)

  useEffect(() => {
    fetch(`/tickets/${id}`)
      .then(res => res.json())
      .then(data => setTicket(data))
  }, [id])

  const handleChangeEstado = (nuevoEstado: string) => {
    fetch(`/tickets/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado }),
    }).then(() => setTicket({ ...ticket, estado: nuevoEstado }))
  }

  if (!ticket) return <div className="p-4">Cargando...</div>

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Ticket #{ticket.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><strong>Título:</strong> {ticket.titulo}</div>
          <div><strong>Descripción:</strong> {ticket.descripcion}</div>
          <div><strong>Estado actual:</strong> {ticket.estado}</div>
          <div><strong>Creado por:</strong> {ticket.creador.nombre}</div>
          <div className="mt-4">
            <Select onValueChange={handleChangeEstado} defaultValue={ticket.estado}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {estadosDisponibles.map(e => (
                  <SelectItem key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

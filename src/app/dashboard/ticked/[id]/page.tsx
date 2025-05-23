"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Button } from "../../../../components/ui/button"
import { FileText, ChevronRight, Link } from "lucide-react"
import '../styles.css';
import { useEffect, useState } from "react";

const [tickets, setTickets] = useState([]);
const groupedTickets = tickets.reduce((acc, ticket) => {
  const status = ticket.status.toLowerCase();
  if (!acc[status]) acc[status] = [];
  acc[status].push(ticket);
  return acc;
}, {} as Record<string, any[]>);


useEffect(() => {
  const fetchTickets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/tickets/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error("Error al cargar los tickets:", err);
    }
  };
  fetchTickets();
}, []);

export default function TickedPage() {
  function formatRelativeDate(created_at: any): import("react").ReactNode {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <TabsContent value="abierto">
            <div className="space-y-4">
              {groupedTickets.abierto?.length > 0 ? (
                groupedTickets.abierto.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-white p-4 rounded-md border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Ticket {ticket.codigo}</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            {ticket.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Fecha: {new Date(ticket.created_at).toLocaleDateString()} · Creado por: {ticket.creator_name}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">{ticket.category_name}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatRelativeDate(ticket.created_at)}
                          </span>
                        </div>
                        <Link href={`/tickets/${ticket.id}`}>
                          <Button variant="outline" size="sm">
                            <span className="mr-2">Ver detalles</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-40 border rounded-md">
                  <p className="text-gray-500">No hay tickets abiertos</p>
                </div>
              )}
            </div>
          </TabsContent>

        </CardContent>
      </Card>
    </div>
  )
}

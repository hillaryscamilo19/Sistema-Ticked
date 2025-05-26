import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { FileText, ChevronRight} from "lucide-react"
import '../[id]/style.css';
import { useEffect, useState } from "react";

export default function TickedAsigando() {
  // ✅ Los hooks van DENTRO del componente
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
        const res = await fetch("http://localhost:8000/tickets/", {
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

  function formatRelativeDate(created_at: any) {
    // Implementación básica para formatear fecha relativa
    const date = new Date(created_at);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} días`;
    }
  }

  return (
    <div>
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle>Mis asignados</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="abierto">
            <TabsList className="tabs-list">
              <TabsTrigger value="abierto">Abiertos ({groupedTickets.abierto?.length || 0})</TabsTrigger>
              <TabsTrigger value="proceso">En Proceso ({groupedTickets.proceso?.length || 0})</TabsTrigger>
              <TabsTrigger value="completado">Completados ({groupedTickets.completado?.length || 0})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="abierto">
              <div className="space-y-4">
                {groupedTickets.abierto?.length > 0 ? (
                  groupedTickets.abierto.map((ticket) => (
                    <div
                      key={ticket.id}
                     className="ticket-item"
                    >
                      <div  className="ticket-details">
                        <div className="ticket-header">
                         
                            <span className="">Ticket {ticket.codigo}</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                              {ticket.status}
                            </span>
                          <div className="">
                            Fecha: {new Date(ticket.created_at).toLocaleDateString()} · Creado por: {ticket.creator_name}
                          </div>
                        </div>
                        <div className="">
                          <div className="">
                            <div className="">
                              <FileText className="" />
                              <span className="">{ticket.category_name}</span>
                            </div>
                            <span className="">
                              {formatRelativeDate(ticket.created_at)}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            <span className="">Ver detalles</span>
                            <ChevronRight className="" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="">
                    <p className="">No hay tickets abiertos</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="proceso">
              <div className="">
                {groupedTickets.proceso?.length > 0 ? (
                  groupedTickets.proceso.map((ticket) => (
                    <div key={ticket.id} className="">
                      {/* Mismo contenido que arriba */}
                      <p>Ticket en proceso: {ticket.codigo}</p>
                    </div>
                  ))
                ) : (
                  <div className="">
                    <p className="">No hay tickets en proceso</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completado">
              <div className="">
                {groupedTickets.completado?.length > 0 ? (
                  groupedTickets.completado.map((ticket) => (
                    <div key={ticket.id} className="">
                      {/* Mismo contenido que arriba */}
                                                  <span className="">
                              {formatRelativeDate(ticket.created_at)}
                            </span>
                    </div>
                  ))
                ) : (
                  <div className="">
                    <p className="">No hay tickets completados</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
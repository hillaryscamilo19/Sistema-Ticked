// hooks/useTickets.ts
import { useEffect, useState } from "react";
import axios from "axios";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status: string;
  // Añade más campos si los necesitas
};

export type StatsType = {
  total: number;
  byStatus: { [key: string]: number };
};

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    byStatus: {
      abierto: 0,
      en_proceso: 0,
      en_espera: 0,
      en_revision: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/tickets/asignados-a-mi/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const tickets: Ticket[] = res.data;

        const counts: { [key: string]: number } = {
          abierto: 0,
          en_proceso: 0,
          en_espera: 0,
          en_revision: 0,
        };

        tickets.forEach((ticket: Ticket) => {
          if (Object.prototype.hasOwnProperty.call(counts, ticket.status)) {
            counts[ticket.status]++;
          }
        });

        setTickets(tickets);
        setStats({
          total: tickets.length,
          byStatus: counts,
        });
      } catch (error) {
        console.error("Error al obtener tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { tickets, stats, isLoading };
};

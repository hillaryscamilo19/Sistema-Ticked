"use client";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import "../app/dashboard/styles.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";

// Tipos
type StatsType = {
  total: number;
  byStatus: { [key: string]: number }; // claves como "0", "1", etc.
};

type Ticket = {
  status: string;
};

export function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    byStatus: { "0": 0, "1": 0, "2": 0, "5": 0 },
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await axios.get("/tickets");
      const tickets: Ticket[] = res.data;

      const counts: { [key: string]: number } = { "0": 0, "1": 0, "2": 0, "5": 0 };

      tickets.forEach((ticket: Ticket) => {
        if (counts.hasOwnProperty(ticket.status)) {
          counts[ticket.status]++;
        }
      });

      setStats({
        total: tickets.length,
        byStatus: counts,
      });

      setIsLoading(false);
    };

    fetchTickets();
  }, []);

  return (
    <div className="container">
      <h1 className="text-gray-900 text-xl font-semibold mb-1">Tickets</h1>
      <h1 className="mb-7 font-serif text-gray-400">
        Estadísticas sobre los tickets asignados al usuario.
      </h1>
      <div className="container-arriba p-4 rounded-md mb-4">
        <div className="PanelTicked">
          <ClipboardDocumentListIcon className="IconoList" />
          <WrenchIcon className="IconoWrench" />
          <ClockIcon className="IconoClock" />
          <DocumentMagnifyingGlassIcon className="IconoDocument" />
        </div>
        <div className="PanelNombre">
          <span className="bg-stone-50">
            Asignados:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.total}
            </p>
          </span>
          <span className="bg-stone-50">
            Procesos:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.byStatus["0"] || 0}
            </p>
          </span>
          <span className="bg-stone-50">
            Espera:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.byStatus["1"] || 0}
            </p>
          </span>
          <span className="bg-stone-50">
            Revisión:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.byStatus["5"] || 0}
            </p>
          </span>
        </div>
      </div>

      <div className="container-abajo bg-stone-50">
        <div className="img">
    
        </div>
      </div>
    </div>
  );
}

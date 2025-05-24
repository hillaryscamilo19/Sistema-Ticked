"use client";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  WrenchIcon,
} from "@heroicons/react/24/outline";
import { useTickets } from "../../hooks/useTickets";
import "./styles.css";

export default function Dashboard() {
  const STATUS_LABELS: Record<number, string> = {
    1: "Proceso",
    2: "Espera",
    3: "Revisión",
  };

  const { stats, tickets, isLoading } = useTickets();

  return (
    <div>
      <div className="container">
        <h1 className="text-Ticked text-xl font-semibold mb-1  ">Tickets</h1>
        <h1 className="mb-7 font-serif text-Estadistica ">
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
                <span className="">
                  Asignado:
                  <p className="text-3xl font-bold">
                    {isLoading ? "..." : stats.total}
                  </p>
                </span>
                {[1, 2, 3].map((statusCode) => (
                  <span className="bg-stone-50" key={statusCode}>
                    {STATUS_LABELS[statusCode]}:
                    <p className="text-3xl font-bold">
                      {isLoading ? "..." : stats.byStatus[statusCode] ?? 0}
                    </p>
                  </span>
                ))}
              </div>
        
        </div>
      </div>
    </div>
  );
}

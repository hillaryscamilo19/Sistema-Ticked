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
  const { stats, tickets, isLoading } = useTickets();

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
            Total:
            <p className="text-3xl font-bold">{isLoading ? "..." : stats.total}</p>
          </span>
          <span className="bg-stone-50">
            En Proceso:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.byStatus["en_proceso"]}
            </p>
          </span>
          <span className="bg-stone-50">
            En Espera:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.byStatus["en_espera"]}
            </p>
          </span>
          <span className="bg-stone-50">
            Revisión:
            <p className="text-3xl font-bold">
              {isLoading ? "..." : stats.byStatus["en_revision"]}
            </p>
          </span>
        </div>
      </div>

      <div className="container-abajo bg-stone-50 p-4">
        <h2 className="text-lg font-semibold mb-2">Lista de Tickets</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Título</th>
              <th className="py-2 px-3">Estado</th>
              <th className="py-2 px-3">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">Cargando tickets...</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t">
                  <td className="py-2 px-3">{ticket.id}</td>
                  <td className="py-2 px-3">{ticket.title}</td>
                  <td className="py-2 px-3 capitalize">{ticket.status}</td>
                  <td className="py-2 px-3">{ticket.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

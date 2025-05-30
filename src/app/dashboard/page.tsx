"use client";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  WrenchIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTickets } from "../../hooks/useTickets";
import "./styles.css";
import Home from "../../img/Home.png";

export default function Dashboard() {
  const STATUS_LABELS: Record<number, string> = {
    0: "Asignados",
    1: "Proceso",
    2: "Espera",
    3: "Revisión",
  };

  const { stats, tickets, isLoading } = useTickets();

  return (
    <div className="container">
      <div className="">
        <div className="container-Title">
          <h3 className="text-Ticked text-xl font-semibold mb-1  ">Tickets</h3>
          <h3 className="mb-7 font-serif text-Estadistica ">
            Estadísticas sobre los tickets asignados al usuario.
          </h3>
        </div>

        <div className="container-Estadistica">
          <div className="icono-tabs">
            <span>
              <ClipboardDocumentListIcon className="IconoLista" />
            </span>
            <span>
              <WrenchIcon className="IconoWrench" />
            </span>

            <span>
              <ClockIcon className="IconoClock" />
            </span>
            <span>
              <DocumentMagnifyingGlassIcon className="IconoDocument" />
            </span>
          </div>
          <div className="Container-Icono">
            {[0, 1, 2, 3].map((statusCode) => (
              <span className="bg-stone-50" key={statusCode}>
                <p className="Number">
                  {isLoading ? "" : stats.byStatus[statusCode] ?? 0}
                </p>
                <p className="title-text">{STATUS_LABELS[statusCode]}</p>
              </span>
            ))}
          </div>
        </div>

        <div className="container-abajo">
          <img src={Home} width={520}></img>
        </div>

        <div className="foorted">
          <h2>Colaboradores del Departamento</h2>
          <div className="colaboradores">
            <div className="colaborador">
              <UserIcon width={36} />
              <div>
                <h3>Randy Alejandro Gomez Garcia</h3>
                <p>asistentesistema@ssv.com.do | #3901</p>
              </div>
            </div>
            <div className="colaborador">
              <UserIcon width={36} />
              <div>
                <h3>Ignacio Martinez</h3>
                <p>isantiago@ssv.com.do | #3903</p>
              </div>
            </div>
            <div className="colaborador">
              <UserIcon width={36} />
              <div>
                <h3>Hillarys Camilo</h3>
                <p>hcamilo@ssv.com.do | #3904</p>
              </div>
            </div>
            <div className="colaborador">
              <UserIcon width={36} />
              <div>
                <h3>Jairo Perdomo</h3>
                <p>jairoperdomo43@gmail.com | #3906</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

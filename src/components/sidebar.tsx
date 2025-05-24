import {
  HomeIcon,
  PlusIcon,
  BuildingOffice2Icon,
  DocumentDuplicateIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Logo from "../img/LogTYZ.png";
import "../style.css";



export function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="logo-wrapper">
        <img className="imgLogo" src={Logo} alt="TYZ Logo" width={150} height={80} />
      </div>

      <div className="nav-sections">
        {/* INICIO */}
        <div className="nav-section">
          <h2 className="section-title">TICKET</h2>
          <Link to="/dashboard" className="nav-link">
            <HomeIcon className="nav-icon" />
            <span>Inicio</span>
          </Link>
          <Link  to="/dashboard/crear"  className="nav-link">
            <PlusIcon className="nav-icon" />
            <span>Crear nuevo ticket</span>
          </Link>
        </div>

        {/* ASIGNADOS */}
        <div className="nav-section">
          <h2 className="section-title">ASIGNADOS</h2>
          <Link to="/mis-tickets" className="nav-link">
            <TicketIcon className="nav-icon" />
            <span>Mis tickets asignados</span>
          </Link>
          <Link to="/departamento" className="nav-link">
            <BuildingOffice2Icon className="nav-icon" />
            <span>Asignados al departamento</span>
          </Link>
        </div>

        {/* CREADOS */}
        <div className="nav-section">
          <h2 className="section-title">CREADOS</h2>
          <Link to="/nuestros-creados" className="nav-link">
            <DocumentDuplicateIcon className="nav-icon" />
            <span>Nuestros creados</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

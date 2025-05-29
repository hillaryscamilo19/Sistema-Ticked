import {
  PlusCircleIcon,
  BuildingOfficeIcon,
  TicketIcon,
  GlobeAmericasIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Logo from "../img/tyzlogo.png";
import "../style.css";



export function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="logo-wrapper">
        <img className="imgLogo" src={Logo} alt="TYZ Logo" width={260} height={110} />
      </div>

      <div className="nav-sections">
        {/* INICIO */}
        <div className="nav-sectio Inicio">
          <h2 className="section-title">INICIO</h2>
          <Link to="/dashboard" className="nav-link">
            <GlobeAmericasIcon className="nav-icon" />
            <span className="NavInicio">Inicio</span>
          </Link>
       
        </div>

        {/*Ticked */}

        <div  className="nav-sections">
          <div className="Ticked">
          <h2 className="section-title">TICKETS</h2>
          <Link  to="/dashboard/crear"  className="nav-link">
            <PlusCircleIcon className="nav-icon" />
            <span className="NavTicked">Crear nuevo ticket</span>
          </Link>
          </div>
        </div>

        {/* ASIGNADOS */}
        <div className="nav-section gruop">
          <h2 className="section-title">ASIGNADOS</h2>
          <Link to="/dashboard/asignado" className="nav-link">
            <TicketIcon className="nav-icon" />
            <span className="Asigni">Mis tickets asignados</span>
          </Link>
          <Link to="/dashboard/departamento" className="nav-link">
            <BuildingOfficeIcon className="nav-icon" />
            <span className="Departamen">Asignados al departamento</span>
          </Link>
        </div>

        {/* CREADOS */}
        <div className="nav-section Nav-creados">
          <h2 className="section-title">CREADOS</h2>
          <Link to="/dashboard/ourcreate" className="nav-link">
            <ClipboardDocumentListIcon className="nav-icon" />
            <span className="Departamen">Nuestros creados</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

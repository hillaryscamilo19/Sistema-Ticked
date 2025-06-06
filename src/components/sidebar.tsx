import {
  PlusCircleIcon,
  BuildingOfficeIcon,
  TicketIcon,
  GlobeAmericasIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet } from "react-router-dom";
import Logo from "../img/tyzlogo.png";
import { useState, useEffect } from "react";
import { Moon, Sun, LogOut } from "lucide-react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import "../global.css";


  type Usuario = {
    _id: string;
    fullname?: string;
    role?: string;
    departamento_id?: string;
  };

export function Sidebar() {
  const [darkMode, setDarkMode] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [departamento, setDepartamento] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toggleTheme = () => setDarkMode(!darkMode);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  const fetchDepartamento = async () => {
    try {
      console.log("Usuario cargado:", departamentoId);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const departamentos = await response.json();
      const found = departamentos.find((d: any) => d.id === departamentoId);
      setDepartamento(found ? found.nombre : "No encontrado");
    } catch {
      setDepartamento("Error");
    }
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        console.log("Usuario cargado:", usuario);
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch("http://localhost:8000/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          return navigate("/login");
        }

        const data = await res.json();
        setUsuario(data);
      if (data.departamento_id) fetchDepartamento(data.departamento_id);

      } catch {
        console.error("Error al cargar usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  return (
    <div className="sidebar-container">
      {/* SIDEBAR */}

      <div className="nav-sections">
        <div className="logo-wrapper">
          <img
            className="imgLogo"
            src={Logo}
            alt="TYZ Logo"
            width={200}
            height={106}
          />
        </div>
        {/* INICIO */}
        <div className="nav-sectio Inicio">
          <h2 className="section-title">INICIO</h2>
          <Link to="/dashboard" className="nav-link">
            <GlobeAmericasIcon className="nav-icon" />
            <span className="Textle-Nav">Inicio</span>
          </Link>
        </div>

        {/*Ticked */}

        <div className="nav-sections">
          <div className="Ticked">
            <h2 className="section-title">TICKETS</h2>
            <Link to="/dashboard/crear" className="nav-link">
              <PlusCircleIcon className="nav-icon" />
              <span className="Textle-Nav">Crear nuevo ticket</span>
            </Link>
          </div>

                {/* ASIGNADOS */}
        <div className="nav-section gruop">
          <h2 className="section-title">ASIGNADOS</h2>
          <Link to="/dashboard/asignado" className="nav-link">
            <TicketIcon className="nav-icon" />
            <span className="Textle-Nav">Mis tickets asignados</span>
          </Link>
          <Link to="/dashboard/departamento" className="nav-link">
            <BuildingOfficeIcon className="nav-icon" />
            <span className="Textle-Nav">Asignados al departamento</span>
          </Link>
        </div>

             {/* CREADOS */}
        <div className="nav-section Nav-creados">
          <h2 className="section-title">CREADOS</h2>
          <Link to="/dashboard/ourcreate" className="nav-link">
            <ClipboardDocumentListIcon className="nav-icon" />
            <span className="Textle-Nav">Nuestros creados</span>
          </Link>
        </div>
          
        </div>
      </div>

      {/* HEADER*/}

      <div>
        <nav className="header-container">
          <div className="toggle-switch">
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
            <div className="icon">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
          </div>

          <div className="user-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="user-button"
            >
              <div className="user-info">
                <span className="user-id">
                  {loading ? "Cargando..." : usuario?.fullname || usuario?._id}
                </span>

                <span className="user-role">{loading ? "Cargando..." : usuario?.departamento_id || usuario?.departamento_id}</span>
              </div>
              <UserCircleIcon className="icoHeader" width={50} />
              <span className="arrow">▼</span>
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {usuario?.role === "Administrador" && (
                  <button className="dropdown-item">Panel Administracion</button>
                )}
                <button onClick={handleLogout} className="dropdown-item">
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Contenido principal */}
        <div
          className=""
          style={{
            backgroundColor: "#eaf2f9",
            overflowY: "auto",
            height: "calc(100dvh - 96px)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

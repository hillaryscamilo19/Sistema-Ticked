import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, CircleUserRoundIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../global.css";

export function Header() {
  const [darkMode, setDarkMode] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [departamento, setDepartamento] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  type Usuario = {
    _id: string;
    fullname?: string;
    role?: string;
    departamento_id?: string;
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  const fetchDepartamento = async (departamentoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/departments/", {
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
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await fetch("http://localhost:8000/usuarios", {
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
    <nav className="header-container">
      <div className="toggle-switch">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
        <div className="icon">{darkMode ? <Moon size={18} /> : <Sun size={18} />}</div>
      </div>

      <div className="user-container">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="user-button">
          <div className="user-info">
            <span className="user-id">{loading ? "Cargando..." : usuario?._id}</span>
            <span className="user-role">{departamento}</span>
          </div>
          <CircleUserRoundIcon size={30} />
          <span className="arrow">▼</span>
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            {usuario?.role === "Administrador" && (
              <button className="dropdown-item">Administrador</button>
            )}
            <button onClick={handleLogout} className="dropdown-item">
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

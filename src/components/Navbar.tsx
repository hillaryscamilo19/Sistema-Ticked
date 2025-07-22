import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, CircleUserRoundIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [departamento, setDepartamento] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  type Usuario = {
    _id: string;
    fullname?: string;
    role?: string;
    departamento_id?: string;
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:8000/usuarios", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setUsuario(data);

        if (data.departamento_id) {
          fetchDepartamento(data.departamento_id);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  const fetchDepartamento = async (departamentoId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/departments/", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const departamentos = await response.json();
      const departamentoEncontrado = departamentos.find(
        (dept: any) => dept.id === departamentoId
      );

      if (departamentoEncontrado) {
        setDepartamento(departamentoEncontrado.nombre);
      } else {
        setDepartamento("Departamento no encontrado");
      }
    } catch (error) {
      console.error("Error al cargar el departamento:", error);
      setDepartamento("Error al cargar departamento");
    }
  };

  return (
    <nav className="w-full bg-slate-950 p-4 flex items-center justify-end relative shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer dark:bg-gray-600 peer-checked:bg-green-500"></div>
            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-full"></span>
          </label>
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded-md"
          >
            <div className="flex flex-col items-end mr-2">
              <span className="font-medium">
                {loading ? "Cargando..." : usuario?._id || "Usuario"}
              </span>
              <span className="text-xs text-gray-300">
                {loading ? "" : departamento || "Cargando departamento..."}
              </span>
            </div>
            <CircleUserRoundIcon size={60} />
            <span className="text-sm">▼</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-slate-700 rounded-md shadow-md z-10">
              {usuario?.role === "Administrador" && (
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-600">
                  Administrador
                </button>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-600"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

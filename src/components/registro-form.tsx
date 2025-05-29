import { useEffect, useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";
import tyz from "../img/tyz.png";
import logo from "../img/logo2.png";
import "../style.css";

interface Departamento {
  _id: number;
  name: string;
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departamentos, setDepartamentos] = useState("");
  const [extensión, setExtensión] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [departamentoList, setDepartamentoList] = useState<Departamento[]>([]);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const payload = {
      fullname: name,
      email: email,
      phone_ext: parseInt(extensión, 10),
      department_id: Number(departamentos),
      role: 1,
      username: username,
      password: password,
      status: true,
    };

    try {
      setError("");
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/");
      } else {
        const error = await response.json();
        console.error("Registro fallido:", error);
        setError("Error al registrar. Verifica los campos.");
      }
    } catch (err) {
      console.error("Error al registrarse:", err);
      setError("Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch("http://localhost:8000/departments");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setDepartamentoList(data);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="login-card row">
        {/* Columna Izquierda */}
        <div className="col-md-6 login-left d-none d-md-flex flex-column align-items-center justify-content-center text-center">
          <div className="py-10 px-26 text-center img">
            <img
              src={tyz}
              alt="Logo"
              width={150}
              height={100}
              className="imgae"
            />
            <p className="text-center text-gray-600 mb-8 max-w-sm ">
              Aplicación de tickets interna para las solicitudes realizadas
              entre departamentos.
            </p>
            <img
              className="img-fluid mb-3"
              src={logo}
              alt="Logo"
              width={350}
              height={200}
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="col-md-6 login-right p-5">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-1.5 block font-medium TextSeccion">
              Crear cuenta
            </h2>
            <h1 className="TextTYZ">Registrarse en TYZ</h1>

            {/* Nombre */}
            <div className="mb-4 relative">
              <span className="block mb-1 text-gray-600">Nombre</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escriba su nombre completo"
                  className="InputUsuario"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <UserIcon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4 relative">
              <span className="block mb-1 text-gray-600">Email</span>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Escriba su correo electrónico"
                  className="InputEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <EnvelopeIcon className=" iconoClose  h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Departamento y Extensión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="block mb-1 font-medium text-gray-600">
                  Departamento
                </span>
                <div className="relative">
                  <select
                    name="departments"
                    className="Inputdepartamento"
                    value={departamentos}
                    onChange={(e) => setDepartamentos(e.target.value)}
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentoList.length > 0 ? (
                      departamentoList.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No hay departamentos disponibles</option>
                    )}
                  </select>
                  <BuildingOffice2Icon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div>
                <span className="block mb-1 font-medium text-gray-600">
                  Número de extensión
                </span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escriba su extensión"
                    className="InputUsuario"
                    value={extensión}
                    onChange={(e) => setExtensión(e.target.value)}
                  />
                  <PhoneIcon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="mb-4 relative">
              <span className="block mb-1 text-gray-600">
                Nombre de usuario
              </span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escriba su nombre de usuario"
                  className="InputUsuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <UserIcon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-4 relative">
              <span className="block mb-1 text-gray-600">Contraseña</span>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Escriba su contraseña"
                  className="Inputcontrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <KeyIcon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Botón */}
            <button
              onClick={handleRegister}
              className="w-full Boton hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Registrarse
            </button>

            {/* Enlace a login */}
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-green-600 hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

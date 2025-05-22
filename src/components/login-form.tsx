import { useState } from "react";
import { useApi } from "../hooks/use-api";
import {
  UserIcon,
  LockClosedIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import tyz from "../img/tyz.png";
import logo from "../img/logo2.png";
import "../style.css";
import { authService } from "../lib/api/auth-service";
import { useNavigate, useSearchParams } from "react-router-dom";
export function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const formData = new URLSearchParams();

  // Obtener error de los parámetros de búsqueda
  const errorParam = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string>(
    errorParam === "CredentialsSignin"
      ? "Credenciales inválidas. Por favor, inténtalo de nuevo."
      : ""
  );

  // Usar el hook personalizado para la autenticación
  const { isLoading, execute: login } = useApi(
    async () => {
      return await authService.login({ username, password });
    },
    {
      onSuccess: async (data) => {
        if (data?.access_token) {
          localStorage.setItem("token", data.access_token);
          setIsRedirecting(true);
           navigate("/dashboard");
        } else {
          setErrorMessage("Token no recibido.");
        }
      },
      onError: (error) => {
        console.error("Error al iniciar sesión:", error);
        setErrorMessage(
          "Error al iniciar sesión. Por favor, inténtalo de nuevo."
        );
      },
    }
  );

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="login-card row">
        {/* Columna Izquierda */}
        <div className="col-md-6 login-left d-none d-md-flex flex-column align-items-center justify-content-center text-center">
          <div className="py-10 px-26 text-center img">
            <img src={tyz} alt="Logo" width={150} height={100} className="imgae" />
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
            <h2 className="mb-1.5 block font-medium TextSeccion">Inicio de sesión</h2>
            <h1 className="TextTYZ">
              Iniciar sesión en TYZ
            </h1>

            {/* Mensaje de error */}
            {errorMessage && (
              <div className="error mb-4 text-center p-3 bg-red-100 text-red-700 rounded-lg ">
                <div>
                  <AlertCircle />
                  <AlertTitle className="titleError">Error</AlertTitle>
                </div>
                {errorMessage}
              </div>
            )}

            {/* Input Usuario */}
            <div className="form-group mb-4">
              <span className="block mb-1 text-gray-600">Usuario</span>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="Escriba su nombre de usuario o email"
                  className="InputUsuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <UserIcon className="iconoUser h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="mb-6 relative">
              <span className="block mb-1 text-gray-600">Contraseña</span>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Escriba su contraseña"
                  className="InputUsuario"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isRedirecting}
                />
                <LockClosedIcon className="iconoClose  h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
              
            </div>

            {/* Botón Entrar */}
            <button
              onClick={login}
              type="submit"
              disabled={isLoading || isRedirecting}
              className="w-full Boton hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              <ArrowRightStartOnRectangleIcon className="IconoBoton h-6 mr-1" />
              {isLoading ? "Iniciando sesión..." : "Entrar"}
            </button>

            {/* Registro */}
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No tienes una cuenta?{" "}
              <a href="/registro" className="texto">
                Registrarse
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

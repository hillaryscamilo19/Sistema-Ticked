import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  LockClosedIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTitle } from "../../components/ui/alert";
import "../../style.css";
import { useApi } from "../../hooks/use-api";
import { authService } from "../../lib/api/auth-service";

interface LoginProps {
  setToken: (token: string | null) => void;
  setUsername: (username: string | null) => void;
  setDepartmentName: (departmentName: string | null) => void;
  setUserId: (userId: string | null) => void;
}

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { execute: login, isLoading } = useApi(authService.login, {
    onSuccess: (data) => {
      if (!data?.token) {
        setErrorMessage("Credenciales inválidas");
        return;
      }
      localStorage.setItem("token", data.token);
      setIsRedirecting(true);
      navigate("/dashboard");
    },
    onError: () => {
      setErrorMessage("Error al iniciar sesión");
    },
  });

  const queryParams = new URLSearchParams(location.search);
  const errorParam = queryParams.get("error");

  useEffect(() => {
    if (errorParam === "CredentialsSignin") {
      setErrorMessage("Credenciales inválidas. Por favor, inténtalo de nuevo.");
    }
  }, [errorParam]);

  return (
    <div className="login-">
      <div className="login-card row">
        {/* Columna Izquierda */}
        <div className="col-md-6 login-left d-none d-md-flex flex-column align-items-center justify-content-center text-center">
          <div className="py-10 px-26 text-center img">
            <img src="/img/logo2.png" alt="Logo" width={250} height={100} />
            <p className="text-center text-gray-600 mb-8 max-w-sm">
              Aplicación de tickets interna para las solicitudes realizadas
              entre departamentos.
            </p>
            <img src="/img/logo2.png" alt="Logo" width={250} height={100} />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="col-md-6 login-right p-5">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-1.5 block font-medium TextSeccion">
              Inicio de sesión
            </h2>
            <h1 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Iniciar sesión en TYZ
            </h1>

            {errorMessage && (
              <div className="error mb-4 text-center p-3 bg-red-100 text-red-700 rounded-lg">
                <div className="flex justify-center items-center gap-2">
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
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <UserCircleIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
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
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isRedirecting}
                />
                <LockClosedIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            {/* Botón Entrar */}
            <button
              onClick={() => login({ username, password })}
              type="submit"
              disabled={isLoading || isRedirecting}
              className="Boton flex justify-center w-full cursor-pointer rounded-lg border color-tyz text-white py-2 hover:bg-green-500 transition"
            >
              <ArrowRightStartOnRectangleIcon className="w-6 h-6 mr-1" />
              {isLoading ? "Iniciando sesión..." : "Entrar"}
            </button>

            {/* Registro */}
            <p className="text-center text-sm text-gray-600 mt-4">
              ¿No tienes una cuenta?{" "}
              <a href="/registro" className="text-green-600 hover:underline">
                Registrarse
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

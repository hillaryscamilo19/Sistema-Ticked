"use client"
import { useEffect, useState } from "react"
import { UserIcon, EnvelopeIcon, BuildingOffice2Icon, PhoneIcon, KeyIcon } from "@heroicons/react/24/outline"
import { useNavigate, Link } from "react-router-dom"
import tyz from "../img/tyz.png"
import logo from "../img/logo2.png"
import "../app/styles/stylesregistro.css"
import { ErrorDisplay } from "./error-display"
import axios from "axios"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [fullname, setFullname] = useState("");
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("")
  const [phoneExt, setExtension] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [departamentoList, setDepartamentoList] = useState([])
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState(null)
  const [isLoading, setIsLoading] = useState(false) 

  const handleRegister = async () => {
    // Clear previous errors
    setError("")
    setValidationError(null)
    setIsLoading(true) // Iniciar carga

    if (!name.trim()) {
      setError("El nombre es requerido")
      setIsLoading(false)
      return
    }
    if (!email.trim()) {
      setError("El email es requerido")
      setIsLoading(false)
      return
    }
    if (!departamentoSeleccionado) {
      setError("Debe seleccionar un departamento")
      setIsLoading(false)
      return
    }
    if (!extension.trim()) {
      setError("La extensión es requerida")
      setIsLoading(false)
      return
    }
    if (!username.trim()) {
      setError("El nombre de usuario es requerido")
      setIsLoading(false)
      return
    }
    if (!password.trim()) {
      setError("La contraseña es requerida")
      setIsLoading(false)
      return
    }

const payload = {
  fullname: fullname,
  email: email,
  phone_ext: parseInt(phoneExt),
  department_id: parseInt(departmentId),
  role: 1,
  username: username,
  password: password,
  status: false
};


    try {
      const response = await fetch("http://localhost:8000/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});


      if (response.status === 201) {
      
        navigate("/")
      } else {
        const errorData = response.data 
        console.error("Registro fallido:", errorData)
        if (errorData.detail && Array.isArray(errorData.detail)) {
          setValidationError(errorData)
        } else {
          setError(errorData.message || "Error al registrar. Verifica los campos.")
        }
      }
    } catch (err) {
      console.error("Error al registrarse:", err)
      if (axios.isAxiosError(err) && err.response) {
    
        const errorData = err.response.data
        if (errorData.detail && Array.isArray(errorData.detail)) {
          setValidationError(errorData)
        } else {
          setError(errorData.message || err.response.statusText || "Error al registrar. Verifica los campos.")
        }
      } else {
        // Otros errores (ej. de red)
        setError("Error de conexión con el servidor o error inesperado.")
      }
    } finally {
      setIsLoading(false) // Finalizar carga
    }
  }
useEffect(() => {
  const fetchDepartamentos = async () => {
    try {
      const response = await fetch("http://localhost:8000/departments/")
      if (!response.ok) throw new Error("Error al cargar departamentos")

      const data = await response.json() // Aquí obtienes tu array [{id, name}, ...]
      setDepartamentoList(data)
    } catch (error) {
      console.error("Error al cargar los departamentos:", error)
      setError("No se pudieron cargar los departamentos.")
    }
  }

  fetchDepartamentos()
}, [])


  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="login-card row">
        {/* Columna Izquierda */}
        <div className="col-md-6 login-left d-none d-md-flex flex-column align-items-center justify-content-center text-center">
          <div className="py-10 px-26 text-center img">
            <img src={tyz || "/placeholder.svg"} alt="Logo" width={150} height={100} className="imgae" />
            <p className="text-center text-gray-600 mb-8 max-w-sm ">
              Aplicación de tickets interna para las solicitudes realizadas entre departamentos.
            </p>
            <img className="img-fluid mb-3" src={logo || "/placeholder.svg"} alt="Logo" width={350} height={200} />
          </div>
        </div>
        {/* Columna Derecha */}
        <div className="col-md-6 login-right p-5">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-1.5 block font-medium TextSeccion">Crear cuenta</h2>
            <h1 className="TextTYZ">Registrarse en TYZ</h1>
            {/* Nombre */}
            <div className="mb-4 relative">
              <span className="block mb-1 text-gray-600">Nombre</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escriba su nombre completo"
                  className="InputUsuario"
               value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value)
                    if (error || validationError) {
                      setError("")
                      setValidationError(null)
                    }
                  }}
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
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error || validationError) {
                      setError("")
                      setValidationError(null)
                    }
                  }}
                />
                <EnvelopeIcon className=" iconoClose  h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            {/* Departamento y Extensión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="block mb-1 font-medium text-gray-600">Departamento</span>
                <div className="relative">
          <select
  name="departments"
  className="Inputdepartamento"
  value={departamentoSeleccionado}
  onChange={(e) => {
    setDepartamentoSeleccionado(e.target.value)
    if (error || validationError) {
      setError("")
      setValidationError(null)
    }
  }}
>
  <option value="">Seleccione un departamento</option>
  {departamentoList.length > 0 ? (
    departamentoList.map((dept) => (
      <option key={dept.id} value={dept.id}>
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
                <span className="block mb-1 font-medium text-gray-600">Número de extensión</span>
                <div className="relative">
                  <input
                    type="text" // Mantener como texto si el backend espera string
                    placeholder="Escriba su extensión"
                    className="InputUsuario"
                    value={phoneExt}
                    onChange={(e) => {
                      setExtension(e.target.value)
                      if (error || validationError) {
                        setError("")
                        setValidationError(null)
                      }
                    }}
                  />
                  <PhoneIcon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
                </div>
              </div>
            </div>
            {/* Username */}
            <div className="mb-4 relative">
              <span className="block mb-1 text-gray-600">Nombre de usuario</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escriba su nombre de usuario"
                  className="InputUsuario"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (error || validationError) {
                      setError("")
                      setValidationError(null)
                    }
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error || validationError) {
                      setError("")
                      setValidationError(null)
                    }
                  }}
                />
                <KeyIcon className="iconoClose h-5 absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            {/* Validation Errors */}
            {validationError && <ErrorDisplay error={validationError} onDismiss={() => setValidationError(null)} />}
            {/* General Error */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {/* Botón */}
            <button
              onClick={handleRegister}
              className="w-full Boton hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              disabled={isLoading} // Deshabilitar botón durante la carga
            >
              {isLoading ? "Registrando..." : "Registrarse"}
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
  )
}

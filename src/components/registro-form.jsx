"use client"

import { useEffect, useState } from "react"
import { UserIcon, EnvelopeIcon, BuildingOffice2Icon, PhoneIcon, KeyIcon } from "@heroicons/react/24/outline"
import { useNavigate, Link } from "react-router-dom"
import tyz from "../img/tyz.png"
import logo from "../img/logo2.png"
import "../app/styles/stylesregistro.css"
import { ErrorDisplay } from "./error-display"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [departamentos, setDepartamentos] = useState("")
  const [extensión, setExtensión] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [departamentoList, setDepartamentoList] = useState([])
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState(null)

  const handleRegister = async () => {
    // Clear previous errors
    setError("")
    setValidationError(null)

    // Client-side validation
    if (!name.trim()) {
      setError("El nombre es requerido")
      return
    }
    if (!email.trim()) {
      setError("El email es requerido")
      return
    }
    if (!departamentos) {
      setError("Debe seleccionar un departamento")
      return
    }
    if (!extensión.trim()) {
      setError("La extensión es requerida")
      return
    }
    if (!username.trim()) {
      setError("El nombre de usuario es requerido")
      return
    }
    if (!password.trim()) {
      setError("La contraseña es requerida")
      return
    }

    // Validate that extensión is a number
    const phoneExt = Number.parseInt(extensión, 10)
    if (isNaN(phoneExt)) {
      setError("La extensión debe ser un número válido")
      return
    }

    // Validate that departamentos is a number
    const deptId = Number.parseInt(departamentos, 10)
    if (isNaN(deptId) || deptId <= 0) {
      setError("Debe seleccionar un departamento válido")
      return
    }

    console.log("Departamento seleccionado:", departamentos, "Tipo:", typeof departamentos, "Parsed:", deptId)

    const payload = {
      fullname: name.trim(),
      email: email.trim(),
      phone_ext: phoneExt,
      department_id: deptId,
      role: 1,
      username: username.trim(),
      password: password,
      status: true,
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        navigate("/")
      } else {
        const errorData = await response.json()
        console.error("Registro fallido:", errorData)

        // Check if it's a validation error (Pydantic format)
        if (errorData.detail && Array.isArray(errorData.detail)) {
          setValidationError(errorData)
        } else {
          setError(errorData.message || "Error al registrar. Verifica los campos.")
        }
      }
    } catch (err) {
      console.error("Error al registrarse:", err)
      setError("Error de conexión con el servidor")
    }
  }

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const response = await fetch("http://localhost:8000/departments")
        if (!response.ok) throw new Error(`Error: ${response.status}`)
        const data = await response.json()

        // Debug completo: ver la estructura de los datos
        console.log("Datos de departamentos recibidos:", data)
        console.log("Primer departamento:", data[0])
        console.log("Claves del primer departamento:", data[0] ? Object.keys(data[0]) : "No hay departamentos")

        // Intentar diferentes estructuras posibles
        let validDepartments = []

        if (data && data.length > 0) {
          // Verificar si usa _id
          if (data[0]._id !== undefined) {
            console.log("Usando _id")
            validDepartments = data.filter((dept) => dept._id != null)
          }
          // Verificar si usa id
          else if (data[0].id !== undefined) {
            console.log("Usando id")
            validDepartments = data.filter((dept) => dept.id != null)
            // Convertir id a _id para mantener compatibilidad
            validDepartments = validDepartments.map((dept) => ({
              ...dept,
              _id: dept.id,
            }))
          }
          // Si no tiene ni id ni _id, usar todos los datos
          else {
            console.log("No se encontró id ni _id, usando todos los datos")
            validDepartments = data
          }
        }

        console.log("Departamentos válidos:", validDepartments)
        setDepartamentoList(validDepartments)
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
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
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
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
                    value={departamentos}
                    onChange={(e) => {
                      console.log("Valor seleccionado:", e.target.value, "Tipo:", typeof e.target.value)
                      setDepartamentos(e.target.value)
                      if (error || validationError) {
                        setError("")
                        setValidationError(null)
                      }
                    }}
                  >
                    <option value="">Seleccione un departamento</option>
                    {departamentoList.length > 0 ? (
                      departamentoList.map((dept) =>
                        dept.id ? (
                          <option key={dept.id} value={dept._id.toString()}>
                            {dept.name}
                          </option>
                        ) : null,
                      )
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
                    type="text"
                    placeholder="Escriba su extensión"
                    className="InputUsuario"
                    value={extensión}
                    onChange={(e) => {
                      setExtensión(e.target.value)
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
  )
}

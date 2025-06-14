"use client"
import { useState, useEffect } from "react"
import {
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  StopCircleIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [editFormData, setEditFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    department_id: "",
    phone_ext: "",
    role: "",
    status: true,
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [loadingAction, setLoadingAction] = useState(false)

  // Cargar usuarios y departamentos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        const [usuariosResponse, departamentosResponse] = await Promise.all([
          fetch("http://localhost:8000/usuarios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8000/departments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (usuariosResponse.ok) {
          const usuariosData = await usuariosResponse.json()
          setUsuarios(usuariosData)
        }

        if (departamentosResponse.ok) {
          const departamentosData = await departamentosResponse.json()
          setDepartamentos(departamentosData)
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Obtener nombre del departamento por ID
  const getDepartmentName = (departmentId) => {
    const dept = departamentos.find((d) => d._id === departmentId || d.id === departmentId)
    return dept ? dept.name || dept.nombre : "Sin departamento"
  }

  // Filtrar usuarios
  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      (usuario.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usuario.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usuario.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Abrir modal de edición
  const openEditModal = (usuario) => {
    setSelectedUser(usuario)
    setEditFormData({
      fullname: usuario.fullname || "",
      username: usuario.username || "",
      email: usuario.email || "",
      department_id: usuario.department_id || "",
      phone_ext: usuario.phone_ext || "",
      role: usuario.role || "User",
      status: usuario.status !== false,
    })
  }

  // Abrir modal de contraseña
  const openPasswordModal = (usuario) => {
    setSelectedUser(usuario)
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    })
  }

  // Manejar cambios en formulario de edición
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Manejar cambios en formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Guardar cambios de usuario
  const handleSaveUser = async () => {
    if (!selectedUser) return

    setLoadingAction(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/usuarios/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editFormData,
          department_id: editFormData.department_id || null,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsuarios((prev) => prev.map((user) => (user._id === selectedUser._id ? { ...user, ...updatedUser } : user)))
        alert("Usuario actualizado correctamente")
        // Cerrar offcanvas
        const offcanvasElement = document.getElementById("editUserOffcanvas")
        const offcanvas = window.bootstrap?.Offcanvas?.getInstance(offcanvasElement)
        offcanvas?.hide()
      } else {
        const errorData = await response.json()
        alert(`Error al actualizar usuario: ${errorData.detail || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      alert("Error de conexión al actualizar usuario")
    } finally {
      setLoadingAction(false)
    }
  }

  // Restablecer contraseña
  const handleResetPassword = async () => {
    if (!selectedUser) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoadingAction(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8000/usuarios/${selectedUser._id || selectedUser.id}/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            new_password: passwordData.newPassword,
          }),
        },
      )

      if (response.ok) {
        alert("Contraseña restablecida correctamente")
        setPasswordData({ newPassword: "", confirmPassword: "" })
        // Cerrar modal
        const modalElement = document.getElementById("passwordModal")
        const modal = window.bootstrap?.Modal?.getInstance(modalElement)
        modal?.hide()
      } else {
        const errorData = await response.json()
        alert(`Error al restablecer contraseña: ${errorData.detail || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error al restablecer contraseña:", error)
      alert("Error de conexión al restablecer contraseña")
    } finally {
      setLoadingAction(false)
    }
  }

  // Función para cambiar el estado del usuario (activar/desactivar) - CORREGIDA
  const handleToggleUserStatus = async (usuario) => {
    setLoadingAction(true)
    try {
      const token = localStorage.getItem("token")
      const newStatus = !usuario.status

      console.log(`Cambiando estado de usuario ${usuario.username} a ${newStatus}`)

      const response = await fetch(`http://localhost:8000/usuarios/${usuario._id || usuario.id}/toggle-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      console.log("Response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Response data:", result)

        // Actualizar el estado local del usuario
        setUsuarios((prev) => prev.map((user) => (user._id === usuario._id ? { ...user, status: newStatus } : user)))

        // Mostrar notificación
        const statusText = newStatus ? "activado" : "desactivado"
        alert(`Usuario ${usuario.username} ${statusText} correctamente`)
      } else {
        // Manejo mejorado de errores
        let errorMessage = "Error desconocido"
        try {
          const errorData = await response.json()
          console.log("Error data:", errorData)

          if (typeof errorData === "object") {
            errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
          } else {
            errorMessage = String(errorData)
          }
        } catch (parseError) {
          console.error("Error al parsear respuesta de error:", parseError)
          errorMessage = `Error HTTP ${response.status}: ${response.statusText}`
        }

        alert(`Error al cambiar estado del usuario: ${errorMessage}`)
      }
    } catch (error) {
      console.error("Error al cambiar estado del usuario:", error)
      alert(`Error de conexión: ${error.message || "Error desconocido"}`)
    } finally {
      setLoadingAction(false)
    }
  }

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-0">Usuarios</h2>
          <p className="text-muted">Listado de todos los usuarios del sistema.</p>
        </div>
        <button className="btn btn-success">
          <PlusIcon className="me-2" style={{ width: "16px", height: "16px" }} />
          Nuevo Usuario
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <MagnifyingGlassIcon style={{ width: "16px", height: "16px" }} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-2">
          {filteredUsuarios.map((usuario) => (
            <div key={usuario._id} className="col-md-4 col-lg-2">
              <div className="card h-20">
                <div className="card-body">
                  <h5 className="card-title text-center mb-3">{usuario.fullname || usuario.username}</h5>
                  <div className="mb-3">
                    <small className="text-muted d-block mb-2">
                      <UserIcon className="me-2" style={{ width: "16px", height: "16px" }} />
                      {usuario.username}
                    </small>
                    <small className="text-muted d-block mb-2">
                      <EnvelopeIcon className="me-2" style={{ width: "16px", height: "16px" }} />
                      {usuario.email}
                    </small>
                    {usuario.phone_ext && (
                      <small className="text-muted d-block mb-2">
                        <PhoneIcon className="me-2" style={{ width: "16px", height: "16px" }} />
                        {usuario.phone_ext}
                      </small>
                    )}
                    <small className="text-muted d-block mb-2">
                      <BuildingOfficeIcon className="me-2" style={{ width: "16px", height: "16px" }} />
                      {getDepartmentName(usuario.department_id)}
                    </small>
                  </div>

                  {/* Toggle de estado del usuario */}
                  <div className="d-flex justify-content-between align-items-center ">
                    <div className="form-check form-switch d-flex align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`userStatus-${usuario._id}`}
                        checked={usuario.status}
                        onChange={() => handleToggleUserStatus(usuario)}
                        disabled={loadingAction}
                        style={{
                          backgroundColor: usuario.status ? "#73E85B" : "#E2EFDF",
                          borderColor: usuario.status ? "#198754" : "#6c757d",
                        }}
                      />
                      <label className="form-check-label" htmlFor={`userStatus-${usuario._id}`}>
                        {usuario.status ? "Activo" : "Inactivo"}
                      </label>
                    </div>

                   

                      <small className={`${usuario.status ? "text-success" : "text-danger"}`}>
                      <StopCircleIcon className="me-1" style={{ width: "16px", height: "16px" }} />
                      {usuario.status ? "Activo" : "Inactivo"}
                    </small>
                  </div>

                  <div className="text-center">
                    <span className="badge bg-primary rounded-pill">{usuario.role || "User65"}</span>
                  </div>
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => openPasswordModal(usuario)}
                    data-bs-toggle="modal"
                    data-bs-target="#passwordModal"
                  >
                    <KeyIcon className="me-1" style={{ width: "16px", height: "16px" }} />
                    Restablecer
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openEditModal(usuario)}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#editUserOffcanvas"
                  >
                    <PencilSquareIcon className="me-1" style={{ width: "16px", height: "16px" }} />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para restablecer contraseña */}
      <div className="modal fade" id="passwordModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <KeyIcon className="me-2" style={{ width: "20px", height: "20px" }} />
                Restablecer contraseña
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedUser && (
                <div className="mb-3">
                  <p className="text-muted">
                    Restableciendo contraseña para: <strong>{selectedUser.fullname || selectedUser.username}</strong>
                  </p>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Ingrese la nueva contraseña"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirme la nueva contraseña"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button className="btn btn-warning" onClick={handleResetPassword} disabled={loadingAction}>
                {loadingAction ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Cambiando...
                  </>
                ) : (
                  "Cambiar contraseña"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas para editar usuario */}
      <div className="offcanvas offcanvas-end" tabIndex="-1" id="editUserOffcanvas" style={{ width: "400px" }}>
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            <PencilSquareIcon className="me-2" style={{ width: "20px", height: "20px" }} />
            Editar Usuario
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          {selectedUser && (
            <form>
              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={editFormData.fullname}
                  onChange={handleEditChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Departamento</label>
                <select
                  className="form-select"
                  name="department_id"
                  value={editFormData.department_id}
                  onChange={handleEditChange}
                >
                  <option value="">Seleccionar departamento</option>
                  {departamentos.map((dept, index) => (
                    <option key={dept._id || dept.id || `dept-${index}`} value={dept._id || dept.id}>
                      {dept.name || dept.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Número de extensión</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone_ext"
                  value={editFormData.phone_ext}
                  onChange={handleEditChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select className="form-select" name="role" value={editFormData.role} onChange={handleEditChange}>
                  <option key="user" value="User">
                    User
                  </option>
                  <option key="admin" value="Admin">
                    Admin
                  </option>
                  <option key="moderator" value="Moderator">
                    Moderator
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="status"
                    checked={editFormData.status}
                    onChange={handleEditChange}
                  />
                  <label className="form-check-label">Usuario activo</label>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="offcanvas-footer p-3 border-top">
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="offcanvas">
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveUser} disabled={loadingAction}>
              {loadingAction ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

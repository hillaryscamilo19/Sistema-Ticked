"use client";

import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type Departamento = {
  _id: string;
  name: string;
};

export default function AdminDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [loadingAction, setLoadingAction] = useState(false)
    // Función para abrir modal de confirmación
  const openDeleteModal = (departamento) => {
    setSelectedDepartment(departamento)
  }
  const [formData, setFormData] = useState({
    name: "",
    status: "1", // Por defecto "Abierto"
  });

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDepartamentos(data);
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartamentos();
  }, []);


  
  // Función para eliminar departamento
  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este departamento?")) {
      return
    }

    setLoadingAction(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8000/departments/${departmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Actualizar la lista de departamentos
        setDepartamentos((prev) => prev.filter((dept) => (dept._id || dept.id) !== departmentId))
        alert("Departamento eliminado exitosamente")
      } else {
        const errorData = await response.json()
        alert(`Error al eliminar departamento: ${errorData.detail || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error al eliminar departamento:", error)
      alert("Error de conexión al eliminar departamento")
    } finally {
      setLoadingAction(false)
    }
  }


  // Función para extraer el ID del usuario del token JWT
  function parseJwt(token: string) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error al parsear token:", e);
      return null;
    }
    
  }


  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    console.log("Token raw:", token);

    if (!token) {
      alert("Token no encontrado en localStorage");
      return;
    }

    const payload = parseJwt(token);
    console.log("Payload decodificado:", payload);

    if (!payload) {
      alert("Token inválido o corrupto");
      return;
    }

    const userId = payload.sub || payload.user_id || payload.id || null;
    console.log("userId obtenido del token:", userId);

    if (!userId) {
      alert("Usuario no autenticado");
      return;
    }

    // Preparar datos para enviar con la estructura correcta
    const ticketData = {
      name: formData.name,
      status: formData.status,
    };

    console.log("Datos a enviar:", ticketData);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/departments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (res.ok) {
        alert("Departamento creado correctamente.");
        // Resetear formulario
        setFormData({
          name: "",
          status: "1",
        });
      } else {
        const errorData = await res.json();
        console.error("Error respuesta API:", errorData);
        alert("Error al crear departamento: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error al enviar departamento:", error);
      alert("Error de conexión al crear el departamento");
    } finally {
      setLoading(false);
    }
  };

  const filteredDepartamentos = departamentos.filter((departamento) =>
    departamento.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Departamentos</h2>
          <p className="text-muted">Listado de todos los departamentos.</p>
        </div>

        {/*Boton crear nuevo departamento */}
        <button
          className="btn btn-success rounded-circle"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="">
            <PlusIcon
              className="me-2"
              style={{ width: "30px", height: "41px" }}
            ></PlusIcon>
          </i>
        </button>
      </div>

      {/* Modal crear nuevo departamento */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Crear departamento
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
              id="name"
              name="name"
              value={formData.name}
                type="text"
                placeholder="Escriba el nombre del departamento"
                 onChange={handleChange}
              ></input>
            </div>
            <div className="modal-footer">
              <button
                className="border border-secondary btn btn-light text-black"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
              onClick={handleSubmit} 
              className="btn btn-success">Crear</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal editar  departamento */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Editar departamento
              </h1>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="text" />
            </div>

            <div className="form-check d-flex align-items-center align-content-center justify-content-flex-start">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="checkDefault"
              />
              <label className="form-check-label" htmlFor="checkDefault">
                Estado
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn  btn-success">Editar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar departamento..."
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
        <div className="row g-4">
          {filteredDepartamentos.map((departamento) => (
            <div key={departamento._id} className="col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{departamento.name}</h5>
                </div>

                <div className="card-footer bg-white d-flex justify-content-between">
                  <button 
                  className="btn btn-sm btn-outline-danger"
                    onClick={() => openDeleteModal(departamento)}
                    data-bs-toggle="modal"
                    data-bs-target="#deleteDepartmentModal"
                    disabled={loadingAction}
                  >
                    <i className="bi bi-trash me-1">
                      <TrashIcon
                        className="me-2"
                        style={{ width: "24px", height: "20px" }}
                      ></TrashIcon>
                    </i>{" "}
                    Eliminar
                  </button>
                  <button
                    className="btn  btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    <PencilSquareIcon
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    ></PencilSquareIcon>
                    <i className="bi bi-pencil me-1"></i> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      )}

            {/* Modal de confirmación para eliminar */}
            <div className="modal fade" id="deleteDepartmentModal" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <TrashIcon className="me-2 text-danger" style={{ width: "20px", height: "20px" }} />
                      Confirmar eliminación
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div className="modal-body">
                    {selectedDepartment && (
                      <div>
                        <p>¿Estás seguro de que deseas eliminar el departamento:</p>
                        <p className="fw-bold text-center">"{selectedDepartment.name || selectedDepartment.nombre}"?</p>
                        <div className="alert alert-warning">
                          <small>
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer. Si hay usuarios asignados a este
                            departamento, no podrás eliminarlo.
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button  className="btn btn-secondary" data-bs-dismiss="modal">
                      Cancelar
                    </button>
                    <button
               
                      className="btn btn-danger"
                      onClick={() => {
                        if (selectedDepartment) {
                          handleDeleteDepartment(selectedDepartment._id || selectedDepartment.id)
                          // Cerrar modal
                          const modalElement = document.getElementById("deleteDepartmentModal")
                          const modal = window.bootstrap?.Modal?.getInstance(modalElement)
                          modal?.hide()
                        }
                      }}
                      disabled={loadingAction}
                    >
                      {loadingAction ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar departamento"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
}

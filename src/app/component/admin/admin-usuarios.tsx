"use client";

import { useState, useEffect } from "react";
import {
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  StopCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import "../style/styleUsuario.css";

type Usuario = {
  _id: string;
  fullname?: string;
  username: string;
  email: string;
  role?: string;
  department_id: string;
  phone_ext?: string;
  status: boolean;
};

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Usuarios</h2>
          <p className="text-muted">
            Listado de todos los usuarios del sistema..
          </p>
          <div className="colum"></div>
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
          {filteredUsuarios.map((usuario) => (
            <div key={usuario._id} className="col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-center ">
                    {usuario.fullname || usuario.username}
                  </h5>
                  <div className="mb-2">
                    <small className="text-muted d-block">
                      <UserIcon
                        className="me-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <i className="bi bi-person me-1"></i> {usuario.username}
                    </small>
                    <small className="text-muted d-block">
                      <EnvelopeIcon
                        className="me-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <i className="bi bi-envelope me-1"></i> {usuario.email}
                    </small>
                    {usuario.phone_ext && (
                      <small className="text-muted d-block">
                        <PhoneIcon
                          className="me-2"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <i className="bi bi-telephone me-1"></i>{" "}
                        {usuario.phone_ext}
                      </small>
                    )}
                    <small className="text-muted d-block">
                      <BuildingOfficeIcon
                        className="me-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <i className="bi bi-building me-1"></i>{" "}
                      {usuario.department_id || "Sin departamento"}
                    </small>
                    <small
                      className={`d-block ${
                        usuario.status ? "text-success" : "text-danger"
                      }`}
                    >
                      <StopCircleIcon
                        className="me-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <i
                        className={`bi ${
                          usuario.status ? "bi-check-circle" : "bi-x-circle"
                        } me-1`}
                      ></i>
                      {usuario.status ? "Activo" : "Inactivo"}
                    </small>
                  </div>
                  <div className="text-center ">
                    <span className="Role">{usuario.role || "User"}</span>
                  </div>
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <KeyIcon
                      className="btn btn-sm  me-2"
                      style={{ width: "40px", height: "40px" }}
                    ></KeyIcon>
                    <i className="bi bi-key me-1"></i> Restablecer contraseña
                  </button>

                  {/* Modal */}

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
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            <KeyIcon
                              style={{ width: "20px", height: "20px" }}
                            ></KeyIcon>
                            Restablecer contraseña
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <input type="text" placeholder="Nueva contraseña" />
                          <input
                            type="text"
                            placeholder="Confirma nueva contraseña"
                          />
                        </div>
                        <div className="modal-footer botone">
                          <button
                            className="border border-secondary btn btn-light text-black"
                            data-bs-dismiss="modal"
                          >
                            Cancelar
                          </button>
                          <button className="btn bto-cambia btn-success">
                            Cambiar contraseña
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn me-2"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasScrolling"
                    aria-controls="offcanvasScrolling"
                  >
                    <PencilSquareIcon
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    ></PencilSquareIcon>
                    <i className="bi bi-pencil me-1"></i> Editar
                  </button>

                  <div
                    className="offcanvas offcanvas-start"
                    data-bs-scroll="true"
                    data-bs-backdrop="false"
                    tabindex="-1"
                    id="offcanvasScrolling"
                    aria-labelledby="offcanvasScrollingLabel"
                  >
                    <div className="offcanvas-header">
                      <h5
                        className="offcanvas-title"
                        id="offcanvasScrollingLabel"
                      >
                        Offcanvas with body scrolling
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="offcanvas-body">
                      <p>
                        Try scrolling the rest of the page to see this option in
                        action.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Modal restablecer contraseña */}
              <div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

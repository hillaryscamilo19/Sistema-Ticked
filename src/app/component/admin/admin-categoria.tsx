"use client";

import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type Categoria = {
  _id: string;
  name: string;
  departments: {
    _id: string;
    name: string;
  }[];
};

export default function AdminCategoria() {
  const [categoria, setCategoria] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setCategoria(data);
        }
      } catch (error) {
        console.error("Error al cargar categirias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, []);

  const filteredDepartamentos = categoria.filter((categoria) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Categoria</h2>
          <p className="text-muted">Listado de todas las categorias.</p>
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
                Crear Categoria
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
                type="text"
                placeholder="Escriba el nombre de la categoria"
              ></input>
            </div>
            <div className="modal-footer">
              <button
                className="border border-secondary btn btn-light text-black"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button className="btn btn-success">Crear</button>
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
                Editar Categoria
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
              <button className="btn  btn-success">crear</button>
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
              placeholder="Buscar Categoria..."
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
          {filteredDepartamentos.map((categoria) => (
            <div key={categoria._id} className="col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{categoria.name}</h5>
                </div>
                <div>
                  {categoria.departments.map((dep) => (
                    <small key={dep._id} className=" me-2  border border-success rounded bg-success">
                      {dep.name}
                    </small>
                  ))}
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash me-1">
                      <TrashIcon
                        className="me-2"
                        style={{ width: "24px", height: "20px" }}
                      ></TrashIcon>
                    </i>{" "}
                    Eliminar
                  </button>
                  <button
                    className="btn-sm btn-outline-danger"
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
    </div>
  );
}

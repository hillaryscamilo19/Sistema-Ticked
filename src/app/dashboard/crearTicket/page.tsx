"use client";
import { useEffect, useState } from "react";
import "../asignacion/style.css";

import "bootstrap/dist/css/bootstrap.min.css";

type Departamento = {
  _id: string;
  name: string;
};

type Categoria = {
  _id: string;
  name: string;
};

export default function CrearNuevoTicket() {
  const [departamentoList, setDepartamentoList] = useState<Departamento[]>([]);
  const [categoriaList, setCategoriaList] = useState<Categoria[]>([]);
  const [asunto, setAsunto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);

  // Cargar departamentos
  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/departments/");
        const data = await res.json();
        setDepartamentoList(data);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };
    fetchDepartamentos();
  }, []);

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/categories");
        const data = await res.json();
        setCategoriaList(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token de autenticación no encontrado.");
      return;
    }

    const formData = new FormData();
    formData.append("title", asunto);
    formData.append("description", descripcion);
    formData.append("category_id", categoria);
    formData.append("department_id", departamento);
    if (archivo) formData.append("attachment", archivo);

    try {
      const res = await fetch("http://localhost:8000/tickets/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Ticket creado correctamente.");
        // Reset formulario
        setAsunto("");
        setCategoria("");
        setDepartamento("");
        setDescripcion("");
        setArchivo(null);
      } else {
        const errorData = await res.json();
        alert("Error al crear ticket: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error al enviar ticket:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="fs-5 text text-white font-bold">Crear nuevo Ticket</h1>
      </div>

      <div className="p-6 rounded shadow-md main">
        <p className="text-sm text-black">Formulario de creación de ticket</p>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-black">Asunto</label>
          <input
            type="text"
            placeholder="Escriba el asunto de su ticket"
            className="w-full border text-black border-gray-300 rounded px-4 py-2"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-medium text-black">Departamento</label>
            <select
              className="text-dark-emphasis w-full border border-gray-300 rounded-lg px-4 py-2"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
            >
              <option value="">---Seleccione un departamento</option>
              {departamentoList.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-black">Categoría</label>
            <select
              className="text-dark-emphasis w-full border border-gray-300 rounded-lg px-4 py-2"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">---Seleccione una categoría</option>
              {categoriaList.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-black">Descripción</label>
          <textarea
            rows={5}
            placeholder="Describa su solicitud"
            className="w-full border border-gray-300 rounded px-4 py-2 text-black"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <div className="input-group mb-3">
          <input
            type="file"
            className="form-control text-black"
            id="inputGroupFile01"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          />
        </div>

        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition w-100"
          onClick={handleSubmit}
        >
          Enviar Ticket
        </button>
      </div>
    </div>
  );
}

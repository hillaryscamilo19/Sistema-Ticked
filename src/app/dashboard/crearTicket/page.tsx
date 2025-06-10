"use client";

import { useEffect, useState } from "react";
import { TicketIcon } from "@heroicons/react/24/outline";
import TiptapEditor from "../../../components/TiptapEditor";
import "../crearTicket/style.css";

export default function CrearNuevoTicket() {
  const [departamentoList, setDepartamentoList] = useState([]);
  const [categoriaList, setCategoriaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [descripcionHTML, setDescripcionHTML] = useState("");

  // Formulario unificado con los nombres de campos correctos
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    assigned_department_id: "",
    status: "1", // Por defecto "Abierto"
  });

  // Cargar departamentos y categorías
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        const [resDept, resCat] = await Promise.all([
          fetch("http://localhost:8000/departments", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8000/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        const [dataDept, dataCat] = await Promise.all([
          resDept.json(),
          resCat.json(),
        ]);

        console.log("Departamentos:", dataDept);
        console.log("Categorías:", dataCat);

        setDepartamentoList(dataDept);
        setCategoriaList(dataCat);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDatos();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo ${name} cambiado a:`, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en el editor de texto enriquecido
  const handleEditorChange = (html) => {
    setDescripcionHTML(html);
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));
  };

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

    // Validar campos requeridos
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category_id ||
      !formData.assigned_department_id
    ) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Preparar datos para enviar con la estructura correcta
    const ticketData = {
      title: formData.title,
      description: formData.description,
      category_id: Number(formData.category_id),
      assigned_department_id: Number(formData.assigned_department_id),
      created_user_id: Number(userId),
      status: formData.status,
    };

    console.log("Datos a enviar:", ticketData);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (res.ok) {
        alert("Ticket creado correctamente.");
        // Resetear formulario
        setFormData({
          title: "",
          description: "",
          category_id: "",
          assigned_department_id: "",
          status: "1",
        });
        setDescripcionHTML("");
        setArchivo(null);
      } else {
        const errorData = await res.json();
        console.error("Error respuesta API:", errorData);
        alert("Error al crear ticket: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error al enviar ticket:", error);
      alert("Error de conexión al crear el ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="TextPrinci">Crear nuevo Ticket</div>

      <div className="Container">
        <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto">
          <div className="mb-4">
            <div className="container-tex">
              <TicketIcon className="IcoTicked"></TicketIcon>
              <p className="text-2">Formulario de creación de ticket.</p>
            </div>
            <label
              htmlFor="title"
              className="block mb-1 font-medium text-gray-700"
            >
              Asunto
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Escriba el asunto de su ticket"
              className="asunto w-full border border-gray-300 rounded px-4 py-2"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="container-Input">
            <div>
              <label
                htmlFor="assigned_department_id"
                className="block mb-1 font-medium text-gray-700"
              >
                Departamento
              </label>
              <select
                id="assigned_department_id"
                name="assigned_department_id"
                className="Depatamento border-gray-300 rounded px-4 py-2"
                value={formData.assigned_department_id}
                onChange={handleChange}
              >
                <option value="">--- Seleccione un departamento</option>
                {departamentoList.map((dept) => (
                  <option key={dept._id || dept.id} value={dept._id || dept.id}>
                    {dept.name || dept.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="category_id"
                className="block mb-1 font-medium text-gray-700"
              >
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                className="categoria border-gray-300 rounded px-4 py-2"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">--- Seleccione una categoría</option>
                {categoriaList.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name || cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block mb-1 font-medium text-gray-700"
              >
                Estado
              </label>
              <select
                id="status"
                name="status"
                className="border-gray-300 rounded px-4 py-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="1">Abierto</option>
                <option value="2">En Proceso</option>
                <option value="3">En Revisión</option>
                <option value="4">En Espera</option>
                <option value="5">Completado</option>
                <option value="6">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block mb-1 font-medium text-gray-700"
            >
              Descripción
            </label>
            <TiptapEditor
              value={descripcionHTML}
              onChange={handleEditorChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="formFileLg" className="form-label">
              Adjuntar archivo
            </label>
            <input
              className="form-control form-control-lg"
              id="formFileLg"
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`Boton ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar Ticket"}
          </button>
        </div>
      </div>
    </>
  );
}

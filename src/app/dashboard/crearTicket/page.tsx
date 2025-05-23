"use client";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(false);

  // Cargar datos
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [resDept, resCat] = await Promise.all([
          fetch("http://localhost:8000/departments/"),
          fetch("http://localhost:3000/categories", {
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
        setDepartamentoList(dataDept);
        setCategoriaList(dataCat);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDatos();
  }, []);

  const handleSubmit = async () => {
    if (loading) return;

    // Validar campos requeridos
    if (!asunto || !descripcion || !categoria || !departamento) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

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
      setLoading(true);
      const res = await fetch("http://localhost:8000/tickets/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Ticket creado correctamente.");
        // Resetear formulario
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Crear nuevo Ticket</h1>
        <p className="text-sm text-gray-600">
          Formulario de creación de ticket
        </p>
      </div>

      <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto">
        <div className="mb-4">
          <label
            htmlFor="asunto"
            className="block mb-1 font-medium text-gray-700"
          >
            Asunto
          </label>
          <input
            id="asunto"
            type="text"
            placeholder="Escriba el asunto de su ticket"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="departamento"
              className="block mb-1 font-medium text-gray-700"
            >
              Departamento
            </label>
            <select
              id="departamento"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
            >
              <option value="">--- Seleccione un departamento</option>
              {departamentoList.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block mb-1 font-medium text-gray-700"
            >
              Categoría
            </label>
            <select
              id="categoria"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">--- Seleccione una categoría</option>
              {categoriaList.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="descripcion"
            className="block mb-1 font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={5}
            placeholder="Describa su solicitud"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label
            htmlFor="archivo"
            className="block mb-1 font-medium text-gray-700"
          >
            Adjuntar archivo (opcional)
          </label>
          <input
            id="archivo"
            type="file"
            className="w-full text-gray-700"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full px-6 py-2 rounded text-white transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Enviando..." : "Enviar Ticket"}
        </button>
      </div>
    </div>
  );
}

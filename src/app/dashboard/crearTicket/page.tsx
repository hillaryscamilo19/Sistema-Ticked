"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createEditor, type Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { TicketIcon } from "@heroicons/react/24/outline";
import "../crearTicket/style.css";

type Departamento = {
  _id: string;
  name: string;
};

type Categoria = {
  _id: string;
  name: string;
};

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function CrearNuevoTicket() {
  const [departamentoList, setDepartamentoList] = useState<Departamento[]>([]);
  const [categoriaList, setCategoriaList] = useState<Categoria[]>([]);
  const [asunto, setAsunto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [departamento, setDepartamento] = useState("");

  // Slate usa un array de nodos Descendant
  const [value, setValue] = useState<Descendant[]>(initialValue);

  // Guardaremos el HTML generado aquí para enviarlo
  const [descripcionHTML, setDescripcionHTML] = useState("");

  const editor = useMemo(() => withReact(createEditor()), []);

  // Fetch de departamentos y categorías igual que antes
  useEffect(() => {
    console.log("Descripción HTML:", descripcionHTML);
    const html = value.map((node) => serialize(node)).join("\n");
    setDescripcionHTML(html);
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");

        const [resDept, resCat] = await Promise.all([
          fetch("http://localhost:8000/departments"),
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
        setDepartamentoList(dataDept);
        setCategoriaList(dataCat);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDatos();
  }, [value]);

  // Función para convertir nodos Slate a HTML simple (puedes mejorar o usar librerías como slate-html-serializer)
  const serialize = (node: Descendant): string => {
    if ("text" in node) {
      return node.text;
    }
    return node.children.map((n) => serialize(n)).join("");
  };

  const handleSubmit = async () => {
    if (
      asunto.trim() === "" ||
      descripcionHTML.trim() === "" ||
      categoria === null ||
      departamento === null
    ) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token de autenticación no encontrado.");
      return;
    }

    const formData = new FormData();
    formData.append("title", asunto);
    formData.append("description", descripcionHTML);
    formData.append("category_id", categoria);
    formData.append("department_id", departamento);
    if (archivo) formData.append("attachment", archivo);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(res);

      if (res.ok) {
        alert("Ticket creado correctamente.");
        setAsunto("");
        setCategoria("");
        setDepartamento("");
        setValue([
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ]);
        setDescripcionHTML("");
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

  // Manejamos archivo y loading igual que antes
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Renderizado básico de elementos Slate

  return (
    <div className="Container">
      <div className="p-6 bg-white rounded shadow-md max-w-2xl mx-auto">
        <div className="mb-4">
          <div className="container-tex">
            <TicketIcon className="IcoTicked"></TicketIcon>
            <p className="text-2">Formulario de creación de ticket</p>
          </div>
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

        <div className="container-Input">
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
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "8px",
              minHeight: "150px",
              backgroundColor: "white",
            }}
          >
            <textarea
              id="descripcion"
              rows={5}
              placeholder="Describa su solicitud"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={descripcionHTML}
              onChange={(e) => setDescripcionHTML(e.target.value)}
            ></textarea>
          </div>
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
  );
}

import React, { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../global.css";

export function CreateTicketForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then(setDepartments)
      .catch((err) => console.error("Error al cargar departamentos:", err));
  }, []);

  useEffect(() => {
    if (department) {
      fetch(`/api/categories?department=${department}`)
        .then((res) => res.json())
        .then(setCategories)
        .catch((err) => console.error("Error al cargar categorías:", err));
    } else {
      setCategories([]);
    }
  }, [department]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!title || !description || !category || !department) {
      setError("Por favor, completa todos los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const ticketData = {
        title,
        description,
        category,
        assigned_department: department,
        created_user: "123456", // Reemplaza esto por el ID real del usuario
      };

      const ticketRes = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      if (!ticketRes.ok) throw new Error("Error al crear el ticket");

      const newTicket = await ticketRes.json();

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch(`/api/tickets/${newTicket._id}/attachments`, {
          method: "POST",
          body: formData,
        });
      }

      navigate("/dashboard/ticked");
    } catch {
      setError("Error al crear el ticket. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="form-container">
      <h1>Crear nuevo ticket</h1>
      <p className="form-description">
        Completa el formulario para crear una nueva solicitud o reporte de problema.
      </p>

      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Título*</label>
        <input
          type="text"
          value={title}
          placeholder="Describe brevemente el problema"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Departamento*</label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
          <option value="">Selecciona un departamento</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        <label>Categoría*</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!department || categories.length === 0}
          required
        >
          <option value="">
            {!department ? "Selecciona un departamento primero" : "Selecciona una categoría"}
          </option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Descripción*</label>
        <textarea
          rows={5}
          value={description}
          placeholder="Describe detalladamente el problema o solicitud"
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Adjuntos (opcional)</label>
        <input type="file" multiple onChange={handleFileChange} />

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

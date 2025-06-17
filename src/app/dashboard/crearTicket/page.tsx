"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  TicketIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import TiptapEditor from "../../../components/TiptapEditor";
import "../crearTicket/style.css";

interface Department {
  _id?: string;
  id?: string;
  name?: string;
  nombre?: string;
}

interface Category {
  _id?: string;
  id?: string;
  name?: string;
  nombre?: string;
}

interface FormData {
  title: string;
  description: string;
  category_id: string;
  assigned_department_id: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "1", label: "Abierto" },
  { value: "2", label: "En Proceso" },
  { value: "3", label: "En Revisión" },
  { value: "4", label: "En Espera" },
  { value: "5", label: "Completado" },
  { value: "6", label: "Cancelado" },
];

export default function CrearNuevoTicket() {
  const [departamentoList, setDepartamentoList] = useState<Department[]>([]);
  const [categoriaList, setCategoriaList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [descripcionHTML, setDescripcionHTML] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario unificado con los nombres de campos correctos
  const [formData, setFormData] = useState<FormData>({
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
        setLoading(true);
        const token = localStorage.getItem("token");

        const [resDept, resCat] = await Promise.all([
          fetch("http://10.0.0.15:8000/departments", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://10.0.0.15:8000/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!resDept.ok || !resCat.ok) {
          throw new Error("Error al cargar datos");
        }

        const [dataDept, dataCat] = await Promise.all([
          resDept.json(),
          resCat.json(),
        ]);

        setDepartamentoList(dataDept);
        setCategoriaList(dataCat);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setErrors({ general: "Error al cargar departamentos y categorías" });
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  // Función para enviar notificaciones usando el nuevo endpoint

  // Manejar cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Manejar cambios en el editor de texto enriquecido
  const handleEditorChange = (html: string) => {
    setDescripcionHTML(html);
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));

    // Limpiar error de descripción
    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: "",
      }));
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArchivo(file);
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

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "El asunto es obligatorio";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (!formData.category_id) {
      newErrors.category_id = "Debe seleccionar una categoría";
    }

    if (!formData.assigned_department_id) {
      newErrors.assigned_department_id = "Debe seleccionar un departamento";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({
        general: "Token no encontrado. Por favor, inicie sesión nuevamente.",
      });
      return;
    }

    const payload = parseJwt(token);
    if (!payload) {
      setErrors({
        general: "Token inválido. Por favor, inicie sesión nuevamente.",
      });
      return;
    }

    const userId = payload.sub || payload.user_id || payload.id || null;
    if (!userId) {
      setErrors({
        general: "Usuario no autenticado. Por favor, inicie sesión nuevamente.",
      });
      return;
    }

    const ticketData = {
      title: formData.title,
      description: formData.description,
      category_id: Number(formData.category_id),
      assigned_department_id: Number(formData.assigned_department_id),
      created_user_id: Number(userId),
      status: formData.status,
    };

    try {
      setIsSubmitting(true);
      setErrors({});

      const res = await fetch("http://10.0.0.15:8000/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (res.ok) {
        const createdTicket = await res.json();
        console.log("Ticket creado:", createdTicket);

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

        alert(
          "Ticket creado correctamente. Las notificaciones se enviaron automáticamente."
        );
      } else {
        const errorData = await res.json();
        console.error("Error respuesta API:", errorData);
        setErrors({
          general: "Error al crear ticket. Por favor, intente nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error al enviar ticket:", error);
      setErrors({
        general:
          "Error de conexión. Por favor, verifique su conexión a internet.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Crear Nuevo Ticket</h1>
          <div className="breadcrumb">
            <span className="breadcrumb-link">Inicio</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Crear Nuevo Ticket</span>
          </div>
        </div>
        <div className="main-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Cargando formulario...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header con breadcrumb */}
      <div className="page-header">
        <h1 className="page-title">Crear Nuevo Ticket</h1>
        <div className="breadcrumb">
          <span className="breadcrumb-link">Inicio</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Crear Nuevo Ticket</span>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="main-container">
        <div className="form-header">
          <div className="form-header-content">
            <TicketIcon className="form-icon" />
            <div>
              <h2 className="form-title">Formulario de creación de ticket</h2>
              <p className="form-subtitle">
                Complete todos los campos para crear un nuevo ticket
              </p>
            </div>
          </div>
        </div>

        {/* Mostrar errores generales */}
        {errors.general && (
          <div className="error-banner">
            <ExclamationTriangleIcon className="error-icon" />
            <span>{errors.general}</span>
          </div>
        )}

        <div className="form-container">
          {/* Campo Asunto */}
          <div className="form-group">
            <label htmlFor="title" className="form-label required">
              Asunto
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Escriba el asunto de su ticket"
              className={`form-input ${errors.title ? "error" : ""}`}
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          {/* Campos en fila */}
          <div className="form-row">
            <div className="form-group">
              <label
                htmlFor="assigned_department_id"
                className="form-label required"
              >
                Departamento
              </label>
              <select
                id="assigned_department_id"
                name="assigned_department_id"
                className={`form-select ${
                  errors.assigned_department_id ? "error" : ""
                }`}
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
              {errors.assigned_department_id && (
                <span className="error-message">
                  {errors.assigned_department_id}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category_id" className="form-label required">
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                className={`form-select ${errors.category_id ? "error" : ""}`}
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
              {errors.category_id && (
                <span className="error-message">{errors.category_id}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">
                Estado
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo Descripción con Editor */}
          <div className="form-group">
            <label htmlFor="description" className="form-label required">
              Descripción
            </label>
            <div
              className={`editor-container ${
                errors.description ? "error" : ""
              }`}
            >
              <TiptapEditor
                value={descripcionHTML}
                onChange={handleEditorChange}
                placeholder="Describe detalladamente tu solicitud o problema..."
              />
            </div>
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          {/* Campo Archivo */}
          <div className="form-group">
            <label htmlFor="formFileLg" className="form-label">
              Adjuntar archivo
            </label>
            <div className="file-input-container">
              <input
                className="file-input"
                id="formFileLg"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <div className="file-input-info">
                <PaperClipIcon className="file-icon" />
                <span className="file-text">
                  {archivo ? archivo.name : "Seleccionar archivo (opcional)"}
                </span>
              </div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="form-actions">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`submit-button ${isSubmitting ? "loading" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div>
                  Enviando...
                </>
              ) : (
                "Crear Ticket"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

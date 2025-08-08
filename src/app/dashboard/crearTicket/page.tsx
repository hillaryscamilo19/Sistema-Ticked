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
  category: string;
  assigned_department: string;
  status: string;
  attachments: {
    id?: string,
    file_name?: string,
    file_path?: string,
    file_extension?:string
  }
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
    category: "",
    assigned_department: "",
    status: "1", // Por defecto "Abierto",
    attachments: {}
  });

  // Cargar departamentos y categorías
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        setLoading(true);
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

  // Función para subir archivo adjunto
  const uploadAttachment = async (
    ticketId: number,
    file: File
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `http://localhost:8000/tickets/${ticketId}/attachments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al subir archivo:", errorData);
        return false;
      }

      const result = await response.json();
      console.log("Archivo subido exitosamente:", result);
      return true;
    } catch (error) {
      console.error("Error al subir archivo:", error);
      return false;
    }
  };

  // Función para subir imagen desde el editor y obtener URL
  const uploadImageFromEditor = async (
    ticketId: number,
    imageFile: File
  ): Promise<string | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token no encontrado");
      }

      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch(
        `http://localhost:800/tickets/${ticketId}/attachments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al subir imagen:", errorData);
        return null;
      }

      const result = await response.json();
      console.log("Respuesta del servidor para imagen:", result);

      // Construir la URL completa para acceder a la imagen
      const baseUrl = "http://localhost:8000";
      const filePath = result.file_path;

      if (filePath) {
        // Construir la URL completa - el file_path ya incluye /uploads/
        const imageUrl = `${baseUrl}${filePath}`;
        console.log("URL de imagen construida:", imageUrl);
        return imageUrl;
      }

      console.error("No se encontró file_path en la respuesta");
      return null;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };

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

  // Función para procesar imágenes en la descripción HTML
  const processImagesInDescription = async (
    ticketId: number,
    htmlContent: string
  ): Promise<string> => {
    // Buscar todas las imágenes en base64 en el HTML
    const base64ImageRegex =
      /<img[^>]+src="data:image\/[^;]+;base64,([^"]+)"[^>]*>/g;
    let updatedHtml = htmlContent;
    const matches = Array.from(htmlContent.matchAll(base64ImageRegex));

    console.log(
      `Encontradas ${matches.length} imágenes en base64 para procesar`
    );

    for (const match of matches) {
      const fullImgTag = match[0];
      const base64Data = match[1];

      try {
        // Convertir base64 a File
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Determinar el tipo de imagen
        const imageType = fullImgTag.match(/data:image\/([^;]+)/)?.[1] || "png";
        const fileName = `image_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}.${imageType}`;

        const imageFile = new File([byteArray], fileName, {
          type: `image/${imageType}`,
        });

        console.log(`Subiendo imagen: ${fileName}`);

        // Subir la imagen
        const imageUrl = await uploadImageFromEditor(ticketId, imageFile);

        if (imageUrl) {
          console.log(`Imagen subida exitosamente: ${imageUrl}`);
          // Reemplazar la imagen base64 con la URL del servidor
          const newImgTag = fullImgTag.replace(
            /src="data:image\/[^"]+"/,
            `src="${imageUrl}"`
          );
          updatedHtml = updatedHtml.replace(fullImgTag, newImgTag);
        } else {
          console.error(`Error al subir imagen: ${fileName}`);
        }
      } catch (error) {
        console.error("Error procesando imagen:", error);
      }
    }

    console.log("HTML actualizado con URLs de imágenes:", updatedHtml);
    return updatedHtml;
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

    if (!formData.category) {
      newErrors.category = "Debe seleccionar una categoría";
    }

    if (!formData.assigned_department) {
      newErrors.assigned_department = "Debe seleccionar un departamento";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función actualizada handleSubmit
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


    try {
      setIsSubmitting(true);
      setErrors({});

      console.log("Iniciando creación de ticket...");
      console.log("Descripción original:", formData.description);
      console.log("HTML del editor:", descripcionHTML);

      // Verificar si hay imágenes en base64 en la descripción
      const hasBase64Images = descripcionHTML.includes("data:image/");
      console.log("¿Tiene imágenes en base64?", hasBase64Images);

      // Decidir qué descripción usar inicialmente
      const initialDescription = hasBase64Images ? "Procesando contenido00..." : descripcionHTML || formData.attachments.file_path

      // Crear el ticket
      const ticketData = {
        title: formData.title,
        description: initialDescription,
        category: Number(formData.category),
        assigned_department: Number(formData.assigned_department),
        created_user: Number(userId),
        status: formData.status,
        attachments: formData.attachments.id,
      };

      const res = await fetch("http://localhost:8000/tickets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error respuesta API:", errorData);
        setErrors({
          general: "Error al crear ticket. Por favor, intente nuevamente.",
        });
        return;
      }

      const createdTicket = await res.json();
      const ticketId = createdTicket.id;
      console.log("Ticket creado con ID:", ticketId);

      // Procesar imágenes si existen
      let finalDescription = descripcionHTML || formData.attachments.file_path;

      if (hasBase64Images) {
        console.log("Procesando imágenes en la descripción...");
        finalDescription = await processImagesInDescription(
          ticketId,
          descripcionHTML
        );
        console.log("Descripción procesada:", finalDescription);

        // Actualizar la descripción del ticket con las imágenes procesadas
        try {
          const updateResponse = await fetch(
            `http://localhost:8000/tickets/${ticketId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: formData.title,
                description: formData.attachments.file_path,
                category: Number(formData.category),
                assigned_department: Number(formData.assigned_department),
                status: formData.status,
             
              }),
            }
          );

          if (!updateResponse.ok) {
            const updateError = await updateResponse.json();
            console.error("Error al actualizar descripción:", updateError);
            console.error("Status:", updateResponse.status);
          } else {
            console.log("Descripción del ticket actualizada exitosamente");
          }
        } catch (updateError) {
          console.error("Error en la actualización:", updateError);
        }
      }

      // Subir archivo adjunto si existe
      if (archivo) {
        console.log("Subiendo archivo adjunto:", archivo.name);
        const uploadSuccess = await uploadAttachment(ticketId, archivo);
        if (!uploadSuccess) {
          console.warn(
            "El ticket se creó pero hubo un error al subir el archivo adjunto"
          );
        } else {
          console.log("Archivo adjunto subido exitosamente");
        }
      }

      // Resetear formulario
      setFormData({
        title: "",
        description: "",
        category: "",
        assigned_department: "",
        status: "1",
        attachments: formData.attachments
      });
      setDescripcionHTML("");
      setArchivo(null);

      // Resetear el input de archivo
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      alert(
        "Ticket creado correctamente con archivos adjuntos e imágenes procesadas."
      );
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
                htmlFor="assigned_department"
                className="form-label required"
              >
                Departamento
              </label>
              <select
                id="assigned_department"
                name="assigned_department"
                className={`form-select ${
                  errors.assigned_department ? "error" : ""
                }`}
                value={formData.assigned_department}
                onChange={handleChange}
              >
                <option value="">--- Seleccione un departamento</option>
                {departamentoList.map((dept) => (
                  <option key={dept._id || dept.id} value={dept._id || dept.id}>
                    {dept.name || dept.nombre}
                  </option>
                ))}
              </select>
              {errors.assigned_department && (
                <span className="error-message">
                  {errors.assigned_department}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label required">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                className={`form-select ${errors.category ? "error" : ""}`}
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">--- Seleccione una categoría</option>
                {categoriaList.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.name || cat.nombre}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error-message">{errors.category}</span>
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
                  {formData.attachments.file_path ? formData.attachments.file_name : "Seleccionar archivo (opcional)"}
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

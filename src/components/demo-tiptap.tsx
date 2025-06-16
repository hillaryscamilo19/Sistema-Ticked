"use client"

import { useState } from "react"
import TiptapEditor from "./TiptapEditor"
import "../app.css"

export default function DemoTiptap() {
  const [content, setContent] = useState("")

  return (
    <div className="demo-container">
      <div className="demo-content">
        <h1 className="demo-title">Editor Tiptap</h1>
        <p className="demo-subtitle">Editor de texto enriquecido usando Tiptap con todas las funcionalidades</p>

        <div className="editor-wrapper">
          <TiptapEditor
            value={content}
            onChange={setContent}
            placeholder="Comienza a escribir tu descripción aquí..."
          />
        </div>

        {/* Preview del contenido */}
        {content && (
          <div className="content-preview">
            <h3>Vista previa del contenido HTML:</h3>
            <div className="preview-content" dangerouslySetInnerHTML={{ __html: content }} />

            <h3>Código HTML generado:</h3>
            <pre className="html-code">
              <code>{content}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

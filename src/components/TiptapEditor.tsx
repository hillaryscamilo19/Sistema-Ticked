"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { FontFamily } from "@tiptap/extension-font-family"
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  PaintBrushIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline"
import { useCallback, useState } from "react"
import "../app.css"

interface TiptapEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const HEADING_OPTIONS = [
  { value: "paragraph", label: "Normal", level: null },
  { value: "heading", label: "Título 1", level: 1 },
  { value: "heading", label: "Título 2", level: 2 },
  { value: "heading", label: "Título 3", level: 3 },
  { value: "heading", label: "Título 4", level: 4 },
  { value: "heading", label: "Título 5", level: 5 },
  { value: "heading", label: "Título 6", level: 6 },
]

const FONT_FAMILIES = [
  { value: "Inter", label: "Normal" },
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Georgia", label: "Georgia" },
]

const COLORS = [
  "#000000",
  "#374151",
  "#6b7280",
  "#9ca3af",
  "#d1d5db",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#e11d48",
  "#F6FF00",
  "#0900FF",
  "#FF00DD",
  "#FF0004",
  "#FF8000",
  "#8CFF00"
]

export default function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Escribe aquí...",
  className = "",
}: TiptapEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [currentHeading, setCurrentHeading] = useState("Normal")
  const [currentFont, setCurrentFont] = useState("Normal")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      Color,
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
        "data-placeholder": placeholder,
      },
    },
  })

  const setHeading = useCallback(
    (option: (typeof HEADING_OPTIONS)[0]) => {
      if (!editor) return

      if (option.value === "paragraph") {
        editor.chain().focus().setParagraph().run()
        setCurrentHeading("Normal")
      } else if (option.level) {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: option.level as 1 | 2 | 3 | 4 | 5 | 6 })
          .run()
        setCurrentHeading(option.label)
      }
    },
    [editor],
  )

  const setFontFamily = useCallback(
    (fontFamily: string, label: string) => {
      if (!editor) return
      if (fontFamily === "Inter") {
        editor.chain().focus().unsetFontFamily().run()
      } else {
        editor.chain().focus().setFontFamily(fontFamily).run()
      }
      setCurrentFont(label)
    },
    [editor],
  )

  const addLink = useCallback(() => {
    if (!editor) return

    const url = window.prompt("Ingresa la URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt("Ingresa la URL de la imagen:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setColor = useCallback(
    (color: string) => {
      if (!editor) return
      editor.chain().focus().setColor(color).run()
      setShowColorPicker(false)
    },
    [editor],
  )

  if (!editor) {
    return null
  }

  return (
    <div className={`tiptap-editor ${className}`}>
      {/* Header */}
      <div className="tiptap-header">
        <h3 className="tiptap-title">Descripción</h3>
      </div>

      {/* Toolbar */}
      <div className="tiptap-toolbar">
        {/* Text formatting */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
            title="Negrita"
          >
            <BoldIcon className="toolbar-icon" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}
            title="Cursiva"
          >
            <ItalicIcon className="toolbar-icon" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`toolbar-btn ${editor.isActive("underline") ? "active" : ""}`}
            title="Subrayado"
          >
            <UnderlineIcon className="toolbar-icon" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`toolbar-btn ${editor.isActive("strike") ? "active" : ""}`}
            title="Tachado"
          >
            <StrikethroughIcon className="toolbar-icon" />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        {/* Alignment */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: "left" }) ? "active" : ""}`}
            title="Alinear a la izquierda"
          >
            <Bars3BottomLeftIcon className="toolbar-icon" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: "center" }) ? "active" : ""}`}
            title="Centrar"
          >
            <Bars3Icon className="toolbar-icon" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`toolbar-btn ${editor.isActive({ textAlign: "right" }) ? "active" : ""}`}
            title="Alinear a la derecha"
          >
            <Bars3BottomRightIcon className="toolbar-icon" />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        {/* Lists */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-btn ${editor.isActive("bulletList") ? "active" : ""}`}
            title="Lista con viñetas"
          >
            <ListBulletIcon className="toolbar-icon" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-btn ${editor.isActive("orderedList") ? "active" : ""}`}
            title="Lista numerada"
          >
            <NumberedListIcon className="toolbar-icon" />
          </button>
        </div>

        <div className="toolbar-separator"></div>

        {/* Indent */}
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().liftListItem("listItem").run()}
            className="toolbar-btn"
            title="Disminuir sangría"
          >
            <span className="indent-icon">⇤</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
            className="toolbar-btn"
            title="Aumentar sangría"
          >
            <span className="indent-icon">⇥</span>
          </button>
        </div>

        <div className="toolbar-separator"></div>

        {/* Heading dropdown */}
        <div className="toolbar-group">
          <div className="dropdown">
            <select
              value={currentHeading}
              onChange={(e) => {
                const option = HEADING_OPTIONS.find((opt) => opt.label === e.target.value)
                if (option) setHeading(option)
              }}
              className="toolbar-select"
            >
              {HEADING_OPTIONS.map((option) => (
                <option key={`${option.value}-${option.level}`} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="dropdown-icon" />
          </div>
        </div>

        {/* Font family dropdown */}
        <div className="toolbar-group">
          <div className="dropdown">
            <select
              value={currentFont}
              onChange={(e) => {
                const font = FONT_FAMILIES.find((f) => f.label === e.target.value)
                if (font) setFontFamily(font.value, font.label)
              }}
              className="toolbar-select"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.label}>
                  {font.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="dropdown-icon" />
          </div>
        </div>

        <div className="toolbar-separator"></div>

        {/* Additional tools */}
        <div className="toolbar-group">
          <button type="button" onClick={addLink} className="toolbar-btn" title="Insertar enlace">
            <LinkIcon className="toolbar-icon" />
          </button>
          <button type="button" onClick={addImage} className="toolbar-btn" title="Insertar imagen">
            <PhotoIcon className="toolbar-icon" />
          </button>
          <div className="color-picker-container">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="toolbar-btn"
              title="Color de texto"
            >
              <PaintBrushIcon className="toolbar-icon" />
            </button>
            {showColorPicker && (
              <div className="color-picker">
                <div className="color-grid">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => setColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor content */}
      <div className="tiptap-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

"use client"

import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { AlertCircle, X } from "lucide-react"

interface ValidationError {
  type: string
  loc: string[]
  msg: string
  input: any
}

interface ErrorResponse {
  detail: ValidationError[]
}

interface ErrorDisplayProps {
  error?: ErrorResponse
  onDismiss?: () => void
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error || !error.detail || error.detail.length === 0) {
    return null
  }

  const formatFieldPath = (loc: string[]) => {
    return loc.slice(1).join(".")
  }

  const getFieldDisplayName = (fieldPath: string) => {
    const fieldNames: Record<string, string> = {
      department_id: "Departamento",
      phone_ext: "Número de extensión",
      fullname: "Nombre",
      email: "Email",
      username: "Nombre de usuario",
      password: "Contraseña",
    }
    return fieldNames[fieldPath] || fieldPath
  }

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case "int_type":
        return "bg-blue-100 text-blue-800"
      case "string_type":
        return "bg-green-100 text-green-800"
      case "missing":
        return "bg-red-100 text-red-800"
      case "value_error":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Alert className="border-red-200 bg-red-50 mb-4">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <div className="flex items-start justify-between w-full">
        <div className="flex-1">
          <AlertTitle className="text-red-800 mb-2">Error de Validación</AlertTitle>
          <AlertDescription className="text-red-700">Por favor corrige los siguientes errores:</AlertDescription>

          <div className="mt-3 space-y-2">
            {error.detail.map((validationError, index) => (
              <Card key={index} className="border-red-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-red-800">
                      Campo: {getFieldDisplayName(formatFieldPath(validationError.loc))}
                    </CardTitle>
                    <Badge variant="secondary" className={getErrorTypeColor(validationError.type)}>
                      {validationError.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-red-700 mb-2">{validationError.msg}</p>
                  <div className="text-xs text-red-600">
                    <span className="font-medium">Valor recibido:</span>{" "}
                    <code className="bg-red-100 px-1 py-0.5 rounded">
                      {validationError.input === null ? "null" : JSON.stringify(validationError.input)}
                    </code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-red-600 hover:text-red-800 transition-colors"
            aria-label="Cerrar error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  )
}

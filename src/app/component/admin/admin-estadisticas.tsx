"use client"

import { useState, useEffect } from "react"

export default function AdminEstadisticas() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <h2 className="mb-0">Estadísticas</h2>
      </div>

      <p className="text-muted">Estadísticas generales del desempeño de tickets en cada departamento y usuarios.</p>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Tickets Estados x Usuarios</h5>
              <div className="bg-light p-3 rounded" style={{ height: "300px" }}>
                <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                  <div>
                    <i className="bi bi-bar-chart-line fs-1"></i>
                    <p>Gráfico de estados de tickets por usuario</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Tickets Completados x Usuario</h5>
                  <div className="bg-light p-3 rounded" style={{ height: "250px" }}>
                    <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                      <div>
                        <i className="bi bi-bar-chart-line fs-1"></i>
                        <p>Gráfico de tickets completados por usuario</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Tickets Estados x Departamento</h5>
                  <div className="bg-light p-3 rounded" style={{ height: "250px" }}>
                    <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                      <div>
                        <i className="bi bi-bar-chart-line fs-1"></i>
                        <p>Gráfico de estados de tickets por departamento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

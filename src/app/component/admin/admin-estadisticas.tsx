"use client"

import { useState, useEffect, useRef } from "react"
import { ChartBarIcon } from "@heroicons/react/24/outline"
import "../style/stadistica.css"

// Simulación de datos para los gráficos
const mockData = {
  ticketsByUserStatus: {
    labels: [
      "Rodriguez Martinez",
      "Edinson Antonio",
      "Jairo Perdomo",
      "Leonel Argenis",
      "Hillarys Camilo",
      "Alvin Tejada",
      "Randy Alejandro",
    ],
    datasets: [
      {
        label: "Abiertos",
        data: [0, 0, 0, 0, 0, 7, 0],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
      },
      {
        label: "Procesos",
        data: [1, 5, 0, 1, 0, 4, 0],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
      },
      {
        label: "Espera",
        data: [0, 2, 2, 1, 1, 5, 0],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
      },
      {
        label: "Revisión",
        data: [1, 2, 1, 0, 0, 2, 0],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
      },
    ],
  },
  completedTicketsByUser: {
    labels: [
      "Antonio Rosario",
      "Alvin Tejada",
      "Randy Alejandro",
      "Hillarys Camilo",
      "Yenifer Dominguez",
      "Leonel Argenis",
      "Roselyn Perez",
      "Dominico Rodriguez",
      "Jairo Perdomo",
      "Juliet Penzo",
      "Samatha Cruz",
    ],
    data: [200, 0, 300, 15, 100, 0, 110, 260, 25, 25, 0],
  },
  ticketsByDepartmentStatus: {
    labels: ["Redes", "Compras", "Diseño Gráfico", "Tecnología", "Mantenimiento"],
    datasets: [
      {
        label: "Abiertos",
        data: [5, 0, 0, 52, 0],
        backgroundColor: "#22c55e",
      },
      {
        label: "Procesos",
        data: [2, 3, 0, 5, 5],
        backgroundColor: "#f59e0b",
      },
      {
        label: "Espera",
        data: [0, 0, 0, 0, 2],
        backgroundColor: "#3b82f6",
      },
      {
        label: "Revisión",
        data: [0, 0, 0, 12, 3],
        backgroundColor: "#8b5cf6",
      },
    ],
  },
  completedByDepartment: {
    labels: ["Tecnología", "Redes", "Mantenimiento", "Compras", "Diseño Gráfico"],
    data: [65, 15, 12, 5, 3],
    backgroundColor: ["#ef4444", "#22c55e", "#f59e0b", "#3b82f6", "#8b5cf6"],
  },
}

export default function AdminEstadisticas() {
  const [loading, setLoading] = useState(true)
  const lineChartRef = useRef<HTMLCanvasElement>(null)
  const barChartRef = useRef<HTMLCanvasElement>(null)
  const stackedBarChartRef = useRef<HTMLCanvasElement>(null)
  const doughnutChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const loadCharts = async () => {
      // Simulación de carga de datos
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Importar Chart.js dinámicamente
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      // Configurar gráfico de líneas
      if (lineChartRef.current) {
        new Chart(lineChartRef.current, {
          type: "line",
          data: mockData.ticketsByUserStatus,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 20,
                },
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "#f3f4f6",
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
            elements: {
              point: {
                radius: 6,
                hoverRadius: 8,
              },
              line: {
                tension: 0.4,
              },
            },
          },
        })
      }

      // Configurar gráfico de barras - tickets completados por usuario
      if (barChartRef.current) {
        new Chart(barChartRef.current, {
          type: "bar",
          data: {
            labels: mockData.completedTicketsByUser.labels,
            datasets: [
              {
                label: "Completados",
                data: mockData.completedTicketsByUser.data,
                backgroundColor: "#3b82f6",
                borderColor: "#2563eb",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "#f3f4f6",
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  maxRotation: 45,
                },
              },
            },
          },
        })
      }

      // Configurar gráfico de barras apiladas
      if (stackedBarChartRef.current) {
        new Chart(stackedBarChartRef.current, {
          type: "bar",
          data: mockData.ticketsByDepartmentStatus,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                  padding: 15,
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                grid: {
                  color: "#f3f4f6",
                },
              },
            },
          },
        })
      }

      // Configurar gráfico de dona
      if (doughnutChartRef.current) {
        new Chart(doughnutChartRef.current, {
          type: "doughnut",
          data: {
            labels: mockData.completedByDepartment.labels,
            datasets: [
              {
                data: mockData.completedByDepartment.data,
                backgroundColor: mockData.completedByDepartment.backgroundColor,
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  usePointStyle: true,
                  padding: 15,
                },
              },
            },
            cutout: "60%",
          },
        })
      }

      setLoading(false)
    }

    loadCharts()
  }, [])

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-content">
          <ChartBarIcon className="admin-header-icon" />
          <div>
            <h1 className="admin-page-title">Estadísticas</h1>
            <p className="admin-page-subtitle">
              Estadísticas generales del desempeño de tickets en cada departamento y usuarios.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-container">
          <div className="admin-spinner"></div>
          <p className="admin-loading-text">Cargando estadísticas...</p>
        </div>
      ) : (
        <div className="admin-charts-container">
          {/* Gráfico principal - Tickets Estados x Usuarios */}
          <div className="admin-chart-card admin-chart-large">
            <div className="admin-chart-header">
              <h2 className="admin-chart-title">Tickets Estados x Usuarios</h2>
            </div>
            <div className="admin-chart-content">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>

          {/* Gráficos secundarios */}
          <div className="admin-charts-grid">
            {/* Tickets Completados x Usuario */}
            <div className="admin-chart-card">
              <div className="admin-chart-header">
                <h3 className="admin-chart-title">Tickets Completados x Usuario</h3>
              </div>
              <div className="admin-chart-content">
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>

            {/* Tickets Estados x Departamento */}
            <div className="admin-chart-card">
              <div className="admin-chart-header">
                <h3 className="admin-chart-title">Tickets Estados x Departamento</h3>
              </div>
              <div className="admin-chart-content">
                <canvas ref={stackedBarChartRef}></canvas>
              </div>
            </div>

            {/* Tickets Completados X Departamento */}
            <div className="admin-chart-card">
              <div className="admin-chart-header">
                <h3 className="admin-chart-title">Tickets Completados X Departamento</h3>
              </div>
              <div className="admin-chart-content">
                <canvas ref={doughnutChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

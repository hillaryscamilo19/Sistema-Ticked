import "./styles.css";
import { AuthCheck } from "../../components/auth-check";
import Sidebar from "../../components/sidebar";
import { Header } from "../../components/header";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthCheck>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar children={undefined} name={""} departmentName={""} onLogout={function (): void {
          throw new Error("Function not implemented.");
        } } />
        
        {/* Contenido principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header fijo arriba */}
          <Header />
          
          {/* Área de contenido que cambia según la ruta */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
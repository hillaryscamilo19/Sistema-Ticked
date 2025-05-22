import { Outlet } from "react-router-dom";
import "./styles.css";
import { AuthCheck } from "../../components/auth-check";
import Sidebar from "../../components/sidebar";
import { Header } from "../../components/header";

export default function DashboardLayout() {
  return (
    <AuthCheck>
      <div className="flex h-screen">
        <Header />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet /> {/* Aquí se renderizan los hijos */}
          </main>
        </div>
      </div>
    </AuthCheck>
  );
}

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
      <div className="flex h-screen">
       
      </div>
    </AuthCheck>
  )
}
import React, { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthCheckProps {
  children: ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Aquí podrías hacer una verificación más robusta con una petición si deseas
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
    }
  }, [status, navigate]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}

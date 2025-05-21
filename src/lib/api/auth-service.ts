import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "./api-config";

// lib/api/auth-service.ts

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {
  login: async (credentials?: LoginCredentials): Promise<any> => {
  if (!credentials) {
    throw new Error("Credenciales requeridas");
  }

  const { username, password } = credentials;

  const response = await fetch("/api/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }

  return await response.json();
},


  logout: async (): Promise<boolean> => {
    // Tu lógica de logout
    localStorage.removeItem("authToken");
    return true;
  },

  refreshToken: async (): Promise<string | null> => {
    // Tu lógica de refresh
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("authToken");
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem("authToken");
  },
};


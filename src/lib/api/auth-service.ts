import axios from "axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {
login: async (params?: LoginCredentials): Promise<any> => {
  if (!params) {
    throw new Error("Credenciales requeridas");
  }

  const { username, password } = params;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await axios.post(`${API_URL}/token`, {
    username,
    password,
  }, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response) {
    throw new Error("Error al iniciar sesión");
  }

  return response.data; // <--- aquí está la corrección
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

  isAuthenticated: () => !!localStorage.getItem("token"),

  getAccessToken: () => !!localStorage.getItem("token"),
 
};


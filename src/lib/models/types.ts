export interface User {
  id?: string; // antes era _id?: ObjectId
  fullname: string;
  email: string;
  phone_ext?: number;
  department_id: string;
  role: number;
  username: string;
  password?: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}


export interface Department {
  _id?: string
  name: string
}

export interface Category {
  _id?: string
  name: string
  list_departments: string[]
}

export interface Message {
  _id?: string
  message: string
  createdById: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Attachment {
  _id?: string
  file_name: string
  file_path: string
  file_extension: string
  ticket_id: string
}

export interface Ticket {
  _id?: string
  title: string
  description: string
  category: string
  assigned_department: string
  assigned_users: string[]
  created_user: string
  messages: string[]
  status: number
  createdAt?: Date
  updatedAt?: Date
}

export const TicketStatus = {
  CANCELADO: 0,
  ABIERTO: 1,
  PROCESO: 2,
  ESPERA: 3,
  REVISION: 4,
  COMPLETADO: 5,
}

export const UserRoles = {
  ADMIN: 1,
  USUARIO: 2,
  SUPERVISOR: 3,
}

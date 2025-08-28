"use client"

import { useState, useEffect } from "react"
import { XMarkIcon, UserIcon, UserPlusIcon } from "@heroicons/react/24/outline"

interface User {
  id: string
  name: string
  email: string
  employeeId: string
  isAvailable: boolean
  isAssigned: boolean
}

interface AssignUsersModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (userIds: string[]) => void
  currentAssignedUsers?: string[]
}

export default function AssignUsersModal({
  isOpen,
  onClose,
  onAssign,
  currentAssignedUsers = [],
}: AssignUsersModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>(currentAssignedUsers)
  const [loading, setLoading] = useState(false)

  // Mock data - replace with actual API call
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Randy Alejandro Gomez Garcia",
      email: "asistentesistema@ssv.com.do",
      employeeId: "3901",
      isAvailable: true,
      isAssigned: selectedUsers.includes("1"),
    },
    {
      id: "2",
      name: "Jairo Perdomo",
      email: "jairoperdomo43@gmail.com",
      employeeId: "3906",
      isAvailable: true,
      isAssigned: selectedUsers.includes("2"),
    },
    {
      id: "3",
      name: "Hillarys Camilo",
      email: "hcamilo@ssv.com.do",
      employeeId: "3904",
      isAvailable: false,
      isAssigned: selectedUsers.includes("3"),
    },
    {
      id: "4",
      name: "Ignacio Martinez",
      email: "isantiago@ssv.com.do",
      employeeId: "3903",
      isAvailable: true,
      isAssigned: selectedUsers.includes("4"),
    },
  ]

  useEffect(() => {
    if (isOpen) {
      setUsers(mockUsers)
      setSelectedUsers(currentAssignedUsers)
    }
  }, [isOpen, currentAssignedUsers])

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleAssign = () => {
    onAssign(selectedUsers)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <UserPlusIcon className="w-6 h-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Asignar Usuarios</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.map((user) => {
              const isSelected = selectedUsers.includes(user.id)

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <UserIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">
                        #{user.employeeId} - {user.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUserToggle(user.id)}
                    disabled={!user.isAvailable && !isSelected}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : user.isAvailable
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-red-100 text-red-600 cursor-not-allowed"
                    }`}
                  >
                    <UserPlusIcon className="w-5 h-5" />
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">{selectedUsers.length} usuario(s) seleccionado(s)</p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cerrar
              </button>
              <button
                onClick={handleAssign}
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "Asignando..." : "Asignar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

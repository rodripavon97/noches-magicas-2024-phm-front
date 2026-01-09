import { create } from "zustand"

const UseUser = create((set) => {
  const userId = localStorage.getItem("userId")
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const user = JSON.parse(localStorage.getItem("user")) || {}
  return {
    isLoggedIn: !!userId,
    isAdmin,
    userId,
    user,
    cart: [],
    login: () => {
      set({ isLoggedIn: true })
      if (userId) {
        localStorage.setItem("userId", userId)
        set({ userId })
      }
    },
    logout: () => {
      localStorage.removeItem("userId")
      localStorage.removeItem("isAdmin")
      localStorage.removeItem("userFotoPerfil")
      localStorage.removeItem("nombreApellido")
      set({ isLoggedIn: false, isAdmin: false, userId: null, user: {} })
    },
    setUser: (userData) => {
      localStorage.setItem("userId", userData.id)
      localStorage.setItem("isAdmin", userData.esAdm)
      localStorage.setItem("userFotoPerfil", userData.fotoPerfil)
      localStorage.setItem("nombreApellido", userData.nombre + userData.apellido)
      localStorage.setItem("user", JSON.stringify(userData))
      set({ user: userData, isAdmin: userData.esAdm })
    },
  }
})

export default UseUser

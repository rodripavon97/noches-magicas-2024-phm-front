import { create } from "zustand"

interface UserData {
  id: number
  nombre: string
  apellido: string
  fechaNacimiento: string | Date
  fotoPerfil: string
  username: string
  esAdm: boolean
  edad: number
  saldo: number
  dni?: number
  DNI?: number
  _updated?: number
}

interface UserStore {
  isLoggedIn: boolean
  isAdmin: boolean
  userId: string | null
  user: Partial<UserData>
  cart: any[]
  login: () => void
  logout: () => void
  setUser: (userData: UserData) => void
}

const UseUser = create<UserStore>((set) => {
  const userId = localStorage.getItem("userId")
  const isAdmin = localStorage.getItem("isAdmin") === "true"
  const user = JSON.parse(localStorage.getItem("user") || '{}')
  
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
      localStorage.removeItem("user")
      set({ isLoggedIn: false, isAdmin: false, userId: null, user: {} })
    },
    setUser: (userData: UserData) => {
      try {
        // Crear una copia limpia del objeto para evitar problemas de referencia
        // Solo guardamos datos básicos que se pueden serializar sin problemas
        const userClean = {
          id: userData.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          fechaNacimiento: typeof userData.fechaNacimiento === 'string' 
            ? userData.fechaNacimiento 
            : userData.fechaNacimiento,
          fotoPerfil: userData.fotoPerfil,
          username: userData.username,
          esAdm: userData.esAdm,
          edad: userData.edad,
          saldo: userData.saldo,
          dni: userData.dni || userData.DNI || 0, // Aceptar ambos formatos
          // NO incluimos entradasCompradas ni amigosDelUsuario
          // Estos datos se cargan bajo demanda cuando se necesitan
        }
        
        localStorage.setItem("userId", String(userClean.id))
        localStorage.setItem("isAdmin", String(userClean.esAdm))
        localStorage.setItem("userFotoPerfil", userClean.fotoPerfil)
        localStorage.setItem("nombreApellido", userClean.nombre + " " + userClean.apellido)
        localStorage.setItem("user", JSON.stringify(userClean))
        
        // Forzar actualización creando un nuevo objeto con timestamp para garantizar cambio
        set({ 
          user: { ...userClean, _updated: Date.now() }, 
          isAdmin: userClean.esAdm 
        })
      } catch (error) {
        // Error silencioso para evitar logs innecesarios
        console.error('Error al guardar usuario:', error)
      }
    },
  }
})

export default UseUser

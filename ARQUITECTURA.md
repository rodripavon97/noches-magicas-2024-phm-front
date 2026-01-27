# 🏗️ Arquitectura del Proyecto - Noches Mágicas

## 📋 Resumen

Este proyecto implementa una **arquitectura limpia en capas** siguiendo los principios **SOLID** y **Clean Code** con React 19, TypeScript, Axios y Zustand.

## 🎯 Principios Fundamentales

### ✅ Stack Tecnológico

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP
- **Zustand** - State management
- **Custom Hooks** - Lógica reutilizable
- **Chakra UI** - Componentes UI

### ❌ Prohibiciones

- JSX (solo TSX)
- PropTypes (usar TypeScript)
- `useState` para estado global
- `console.log` / `console.error`
- Lógica de negocio en componentes
- `axios` directo (usar `httpClient`)

## 📁 Estructura de Carpetas

```
src/
├── api/              # Capa HTTP - Axios + JWT + XSRF
│   ├── config.ts     # Configuración de la API
│   ├── httpClient.ts # Cliente HTTP con interceptores
│   └── constants.ts  # Constantes de endpoints
│
├── domain/           # Entidades del negocio
│   ├── Usuario.ts
│   ├── Show.ts
│   ├── Carrito.ts
│   └── ...
│
├── services/         # Lógica de negocio (Casos de uso)
│   ├── usuarioService.ts
│   ├── showService.ts
│   └── authService.ts
│
├── stores/           # Estado global con Zustand
│   ├── authStore.ts
│   ├── usuarioStore.ts
│   └── showStore.ts
│
├── hooks/            # Custom Hooks (Orquestación UI)
│   ├── useAuth.tsx
│   ├── useUsuario.tsx
│   ├── useShows.tsx
│   ├── useShowDetalle.tsx
│   ├── useToast.tsx
│   └── useOnInit.tsx
│
├── components/       # Componentes puros (Solo UI)
│   ├── Card/
│   ├── Layout/
│   ├── Navbar/
│   └── ...
│
├── pages/            # Páginas (Screens)
│   ├── Login/
│   ├── Busqueda/
│   ├── Carrito/
│   └── ...
│
├── validations/      # Validaciones de formularios
│   └── index.ts
│
├── errors/           # Manejo centralizado de errores
│   └── index.ts
│
├── types/            # Tipos TypeScript compartidos
│   └── index.ts
│
└── utils/            # Utilidades generales
    ├── dateFormatter.ts
    ├── priceFormatter.ts
    └── ...
```

## 🔄 Flujo de Datos

```
Componente (UI)
    ↓
Custom Hook (Orquestación)
    ↓
Store (Estado) + Service (Lógica)
    ↓
HTTP Client (API)
    ↓
Backend
```

## 📐 Responsabilidades por Capa

### 1️⃣ **API Layer** (`/api`)

**Responsabilidad**: Gestión de comunicación HTTP

- ✅ Configurar cliente Axios
- ✅ Añadir interceptores (JWT, XSRF)
- ✅ Refresh token automático
- ✅ Manejo de errores HTTP
- ❌ NO tiene lógica de negocio

**Ejemplo**:

```typescript
// src/api/httpClient.ts
export const httpClient = new HttpClient()

// Uso obligatorio
const data = await httpClient.get<Usuario>('/user/123')
```

### 2️⃣ **Services Layer** (`/services`)

**Responsabilidad**: Lógica de negocio

- ✅ Casos de uso de la aplicación
- ✅ Transformación de datos
- ✅ Validaciones de negocio
- ❌ NO conoce componentes ni hooks
- ❌ NO usa axios directo

**Ejemplo**:

```typescript
// src/services/usuarioService.ts
class UsuarioService {
  async getInfoUsuario(userId: string): Promise<UsuarioJSON> {
    return httpClient.get<UsuarioJSON>(`/user/${userId}`)
  }
}
```

### 3️⃣ **Stores Layer** (`/stores`)

**Responsabilidad**: Estado global

- ✅ Estado compartido entre componentes
- ✅ Acciones para modificar estado
- ✅ Integración con services
- ❌ NO tiene lógica de negocio compleja
- ❌ NO tiene transformaciones complejas

**Ejemplo**:

```typescript
// src/stores/authStore.ts
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  isLoggedIn: false,
  userId: null,
  login: async (username, password) => { ... },
  logout: () => { ... },
}))
```

### 4️⃣ **Hooks Layer** (`/hooks`)

**Responsabilidad**: Orquestación UI

- ✅ Conectar componentes con stores
- ✅ Conectar componentes con services
- ✅ Validaciones de formularios
- ✅ Manejo de errores para UI
- ❌ NO tiene lógica de negocio
- ❌ NO hace transformaciones de datos

**Ejemplo**:

```typescript
// src/hooks/useAuth.tsx
export function useAuth() {
  const { isLoggedIn, login: loginStore, logout: logoutStore } = useAuthStore()

  const login = async (username: string, password: string) => {
    try {
      await loginStore(username, password)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  return { isLoggedIn, login, logout: logoutStore }
}
```

### 5️⃣ **Components Layer** (`/components` + `/pages`)

**Responsabilidad**: Solo UI

- ✅ Renderizar interfaz
- ✅ Manejar eventos del usuario
- ✅ Usar hooks para lógica
- ❌ NO llaman APIs directamente
- ❌ NO tienen lógica de negocio
- ❌ NO transforman datos

**Ejemplo**:

```typescript
// src/components/Card/CardLogin.tsx
const CardLoginShow = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const toast = useToast()

  const handleLogin = async () => {
    try {
      await login(username, password)
      toast.success('Login exitoso')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return <form>...</form>
}
```

## 🛡️ Manejo de Errores

**OBLIGATORIO**: Todo error debe pasar por `getErrorMessage()`

```typescript
import { getErrorMessage } from '../errors'

try {
  await service.method()
} catch (error) {
  toast.error(getErrorMessage(error))
}
```

❌ **NUNCA** hacer:

```typescript
console.error(error) // ❌
toast.error(error.message) // ❌
alert(error) // ❌
```

## ✅ Validaciones de Formularios

Todas las validaciones deben estar en `/validations`

```typescript
import { validateLoginForm } from '../validations'

const form = { username, password }
const validation = validateLoginForm(form)

if (!validation.isValid) {
  toast.error(Object.values(validation.errors)[0])
  return
}
```

## 🔐 Autenticación JWT

El sistema maneja JWT automáticamente:

1. Login → guarda token en localStorage
2. Cada request → añade token en header `Authorization`
3. Token expirado → refresh automático
4. Refresh falla → logout y redirect a `/login`

## 📊 Estado Global con Zustand

**Cuándo usar Zustand**:

- ✅ Datos del usuario logueado
- ✅ Lista de shows/productos
- ✅ Estado de autenticación
- ❌ Estado local de un formulario
- ❌ Estado de UI temporal

## 🧪 Testing

Los componentes son fáciles de testear porque:

- No tienen lógica de negocio
- Solo dependen de hooks
- Los hooks se pueden mockear fácilmente

## 🚀 Beneficios de esta Arquitectura

1. **Escalable**: Fácil agregar nuevas features
2. **Mantenible**: Código organizado y limpio
3. **Testeable**: Capas independientes
4. **Tipado**: TypeScript en strict mode
5. **Profesional**: Arquitectura empresarial

## 📝 Reglas de Código

### ✅ HACER

- Usar `httpClient` para requests
- Validar formularios con `/validations`
- Manejar errores con `getErrorMessage()`
- Tipar todo con TypeScript
- Componentes puros sin lógica
- Hooks para orquestación
- Stores para estado global

### ❌ NO HACER

- `console.log` / `console.error`
- `axios` directo en componentes
- Lógica de negocio en componentes
- `any` en TypeScript
- Props drilling excesivo
- `useState` para datos remotos

## 🔧 Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint
```

## 📚 Recursos

- [React 19 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com/)

---

**Última actualización**: Enero 2026

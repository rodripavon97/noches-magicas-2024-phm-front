# Agent Migration - React 19 + PNPM + TypeScript + Chakra UI

## 🎯 Objetivo

Migrar proyecto React de NPM a PNPM, actualizar a React 19, convertir hooks JSX a TypeScript, implementar Spinner de carga reutilizable, y establecer patrón de manejo de errores con useToast.

---

## 📋 Checklist de Migración

- [ ] Migrar de NPM a PNPM
- [ ] Actualizar dependencias a React 19
- [ ] Convertir hooks JSX a TypeScript
- [ ] Eliminar archivos .jsx viejos
- [ ] Crear hooks personalizados reutilizables
- [ ] Implementar componente Spinner global
- [ ] Configurar manejo de errores con useToast
- [ ] Try-catch solo en componentes
- [ ] Actualizar .gitignore (NO excluir package.json)

---

## 🔄 PASO 1: Migración NPM → PNPM

### 1.1 Instalar PNPM

```bash
# Instalar PNPM globalmente
npm install -g pnpm

# O con script standalone (recomendado)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Verificar instalación
pnpm --version
```

### 1.2 Limpiar instalación de NPM

```bash
# Eliminar node_modules y lock de npm
rm -rf node_modules package-lock.json

# Si tenías yarn también
rm -rf yarn.lock
```

### 1.3 Actualizar a React 19

```bash
# Actualizar React a versión 19
pnpm add react@^19.0.0 react-dom@^19.0.0

# Actualizar tipos
pnpm add -D @types/react@^19.0.0 @types/react-dom@^19.0.0

# Actualizar otras dependencias clave
pnpm add -D typescript@^5.6.0 vite@^5.0.0

# Actualizar React Router (si lo usas)
pnpm add react-router-dom@^6.22.0
pnpm add -D @types/react-router-dom

# Chakra UI
pnpm add @chakra-ui/react@^2.8.0 @emotion/react@^11.11.0 @emotion/styled@^11.11.0 framer-motion@^11.0.0
```

### 1.4 Crear archivo .npmrc

```bash
# .npmrc en la raíz del proyecto
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true
```

### 1.5 Instalar dependencias

```bash
# Instalar todas las dependencias
pnpm install
```

### 1.6 Actualizar scripts en package.json

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "clean": "rm -rf node_modules pnpm-lock.yaml && pnpm install",
    "migrate:hooks": "find src/hooks -name '*.jsx' -exec sh -c 'mv \"$0\" \"${0%.jsx}.tsx\"' {} \\;"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.22.0",
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/react-router-dom": "^6.5.0",
    "@types/node": "^20.11.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.6.0",
    "vite": "^5.0.0",
    "eslint": "^8.56.0"
  }
}
```

### 1.7 Actualizar .gitignore (IMPORTANTE)

```gitignore
# Dependencias
node_modules/
.pnpm-store/

# Builds
dist/
dist-ssr/
*.local

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
lerna-debug.log*

# Editor
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Testing
coverage/

# Environment
.env
.env.local
.env.*.local

# Lock files de otros package managers (mantener pnpm-lock.yaml)
package-lock.json
yarn.lock

# IMPORTANTE: NO agregar package.json aquí
```

---

## 📝 PASO 2: Migración JSX → TypeScript

### 2.1 Configurar TypeScript

**tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 2.2 Actualizar vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
})
```

### 2.3 Script de migración automática

```bash
# Renombrar todos los .jsx a .tsx en hooks
pnpm migrate:hooks

# O manualmente
find src/hooks -name "*.jsx" -exec sh -c 'mv "$0" "${0%.jsx}.tsx"' {} \;

# Eliminar archivos .jsx después de verificar
find src/hooks -name "*.jsx" -delete
```

---

## 🎨 PASO 3: Setup Chakra UI

### 3.1 Configurar Provider

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
```

### 3.2 Crear tema personalizado (opcional)

```typescript
// src/theme/index.ts
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      500: '#2196f3',
      900: '#0d47a1',
    },
  },
  components: {
    Spinner: {
      defaultProps: {
        size: 'xl',
        thickness: '4px',
        speed: '0.65s',
      },
    },
  },
})

export default theme

// Usar en main.tsx
// <ChakraProvider theme={theme}>
```

---

## 🔄 PASO 4: Spinner de Carga Global

### 4.1 Componente Spinner Reutilizable

```tsx
// src/components/LoadingSpinner.tsx
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  message = 'Cargando...', 
  size = 'xl',
  fullScreen = false
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="blackAlpha.600"
        zIndex={9999}
      >
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size={size}
          />
          {message && (
            <Text color="white" fontSize="lg" fontWeight="medium">
              {message}
            </Text>
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <VStack spacing={3} py={8}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size={size}
      />
      {message && (
        <Text color="gray.600" fontSize="md">
          {message}
        </Text>
      )}
    </VStack>
  )
}
```

### 4.2 Skeleton Placeholders

```tsx
// src/components/SkeletonCard.tsx
import { Box, Skeleton, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react'

export function SkeletonCard() {
  return (
    <Box padding="6" boxShadow="lg" bg="white" borderRadius="md">
      <SkeletonCircle size="12" />
      <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
    </Box>
  )
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </Stack>
  )
}
```

---

## 🎣 PASO 5: Hooks Personalizados con TypeScript

### 5.1 Tipos compartidos

```typescript
// src/types/hooks.ts
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

export interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  refetch: () => Promise<void>
}
```

### 5.2 Hook useApi (sin try-catch)

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react'
import type { UseApiResult, ApiError } from '@types/hooks'

interface UseApiOptions {
  immediate?: boolean
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  const fetchData = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    
    // SIN try-catch - los errores se propagan al componente
    const result = await fetcher()
    setData(result)
    setLoading(false)
  }

  useEffect(() => {
    if (options.immediate) {
      fetchData()
    }
  }, [])

  return { data, loading, error, refetch: fetchData }
}
```

### 5.3 Hook useToastHandler

```typescript
// src/hooks/useToastHandler.ts
import { useToast, UseToastOptions } from '@chakra-ui/react'
import type { ApiError } from '@types/hooks'

interface ToastHandlerOptions {
  successMessage?: string
  errorMessage?: string
}

export function useToastHandler() {
  const toast = useToast()

  const showSuccess = (message: string, options?: UseToastOptions) => {
    toast({
      title: 'Éxito',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  const showError = (error: Error | ApiError | string, options?: UseToastOptions) => {
    const message = typeof error === 'string' 
      ? error 
      : error.message || 'Ocurrió un error inesperado'

    toast({
      title: 'Error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  const showWarning = (message: string, options?: UseToastOptions) => {
    toast({
      title: 'Advertencia',
      description: message,
      status: 'warning',
      duration: 4000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  const showInfo = (message: string, options?: UseToastOptions) => {
    toast({
      title: 'Información',
      description: message,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      ...options,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
```

### 5.4 Hook useForm con validación

```typescript
// src/hooks/useForm.ts
import { useState, ChangeEvent, FormEvent } from 'react'

interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

interface UseFormOptions<T> {
  initialValues: T
  validationRules?: ValidationRules<T>
  onSubmit: (values: T) => Promise<void>
}

interface UseFormResult<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  resetForm: () => void
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  setFieldError: <K extends keyof T>(field: K, error: string) => void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = <K extends keyof T>(field: K, value: T[K]): string | undefined => {
    const rules = validationRules[field]
    if (!rules) return undefined

    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message
      }
    }
    return undefined
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    const field = name as keyof T
    
    // Handle checkboxes
    const fieldValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value

    setValues(prev => ({ ...prev, [field]: fieldValue }))

    if (touched[field]) {
      const error = validateField(field, fieldValue as T[keyof T])
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof T): void => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, values[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validar todos los campos
    const newErrors: Partial<Record<keyof T, string>> = {}
    let hasErrors = false

    (Object.keys(values) as Array<keyof T>).forEach(field => {
      const error = validateField(field, values[field])
      if (error) {
        newErrors[field] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )

    if (hasErrors) return

    setIsSubmitting(true)
    // SIN try-catch - el componente maneja el error
    await onSubmit(values)
    setIsSubmitting(false)
  }

  const resetForm = (): void => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]): void => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  const setFieldError = <K extends keyof T>(field: K, error: string): void => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}
```

### 5.5 Hook useDebounce

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### 5.6 Hook useLocalStorage

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // SIN try-catch - el componente maneja el error
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  const setValue = (value: T | ((val: T) => T)): void => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue]
}
```

### 5.7 Barrel export

```typescript
// src/hooks/index.ts
export { useApi } from './useApi'
export { useToastHandler } from './useToastHandler'
export { useForm } from './useForm'
export { useDebounce } from './useDebounce'
export { useLocalStorage } from './useLocalStorage'

export type { UseApiResult, ApiError } from '@types/hooks'
```

---

## 🎯 PASO 6: Uso en Componentes (con try-catch)

### 6.1 Componente con useApi + manejo de errores

```tsx
// src/components/UserList.tsx
import { useEffect } from 'react'
import { Box, Button } from '@chakra-ui/react'
import { useApi, useToastHandler } from '@hooks'
import { LoadingSpinner } from '@components/LoadingSpinner'
import { SkeletonList } from '@components/SkeletonCard'

interface User {
  id: string
  name: string
  email: string
}

export function UserList() {
  const { showError } = useToastHandler()
  
  const { data: users, loading, refetch } = useApi<User[]>(
    async () => {
      const response = await fetch('/api/users')
      if (!response.ok) throw new Error('Error al cargar usuarios')
      return response.json()
    }
  )

  // TRY-CATCH EN EL COMPONENTE
  const handleRefresh = async () => {
    try {
      await refetch()
    } catch (error) {
      showError(error as Error)
    }
  }

  if (loading) {
    return <SkeletonList count={5} />
  }

  return (
    <Box>
      <Button onClick={handleRefresh} mb={4}>
        Actualizar
      </Button>
      
      {users?.map(user => (
        <Box key={user.id} p={4} shadow="md" borderRadius="md">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </Box>
      ))}
    </Box>
  )
}
```

### 6.2 Componente con useForm + manejo de errores

```tsx
// src/components/LoginForm.tsx
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  Input,
  VStack
} from '@chakra-ui/react'
import { useForm, useToastHandler } from '@hooks'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginForm() {
  const { showSuccess, showError } = useToastHandler()

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: [
        {
          validate: (value) => value.length > 0,
          message: 'El email es requerido',
        },
        {
          validate: (value) => /\S+@\S+\.\S+/.test(value),
          message: 'Email inválido',
        },
      ],
      password: [
        {
          validate: (value) => value.length >= 8,
          message: 'La contraseña debe tener al menos 8 caracteres',
        },
      ],
    },
    onSubmit: async (values) => {
      // TRY-CATCH EN EL COMPONENTE
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Error al iniciar sesión')
        }

        showSuccess('Inicio de sesión exitoso')
      } catch (error) {
        showError(error as Error)
      }
    },
  })

  return (
    <Box maxW="md" mx="auto" p={6} shadow="lg" borderRadius="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.email && touched.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password && touched.password}>
            <FormLabel>Contraseña</FormLabel>
            <Input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isSubmitting}
            loadingText="Iniciando sesión..."
          >
            Iniciar Sesión
          </Button>
        </VStack>
      </form>
    </Box>
  )
}
```

### 6.3 Componente con búsqueda debounced

```tsx
// src/components/SearchProducts.tsx
import { useState, useEffect } from 'react'
import { Input, VStack } from '@chakra-ui/react'
import { useDebounce, useToastHandler } from '@hooks'
import { LoadingSpinner } from '@components/LoadingSpinner'

interface Product {
  id: string
  name: string
}

export function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { showError } = useToastHandler()

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setProducts([])
      return
    }

    // TRY-CATCH EN EL COMPONENTE
    const searchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/search?q=${debouncedSearchTerm}`)
        if (!response.ok) throw new Error('Error al buscar productos')
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        showError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [debouncedSearchTerm])

  return (
    <VStack spacing={4} align="stretch">
      <Input
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <LoadingSpinner size="md" message="Buscando..." />}

      {products.map(product => (
        <Box key={product.id} p={4} shadow="sm" borderRadius="md">
          {product.name}
        </Box>
      ))}
    </VStack>
  )
}
```

### 6.4 Componente con Spinner Full Screen

```tsx
// src/components/Dashboard.tsx
import { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { useToastHandler } from '@hooks'
import { LoadingSpinner } from '@components/LoadingSpinner'

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)
  const { showError } = useToastHandler()

  useEffect(() => {
    // TRY-CATCH EN EL COMPONENTE
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Error al cargar dashboard')
        const result = await response.json()
        setData(result)
      } catch (error) {
        showError(error as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Cargando dashboard..." />
  }

  return (
    <Box>
      {/* Contenido del dashboard */}
    </Box>
  )
}
```

---

## ✅ Checklist Final

### Migración completada
- [ ] PNPM instalado y funcionando
- [ ] React 19 instalado
- [ ] Chakra UI configurado
- [ ] Todos los hooks convertidos a .tsx
- [ ] Archivos .jsx eliminados
- [ ] .gitignore actualizado (package.json NO excluido)
- [ ] pnpm-lock.yaml en el repositorio

### Hooks
- [ ] useApi sin try-catch implementado
- [ ] useToastHandler creado
- [ ] useForm sin try-catch implementado
- [ ] useDebounce implementado
- [ ] useLocalStorage implementado
- [ ] Barrel export en hooks/index.ts

### Componentes
- [ ] LoadingSpinner reutilizable creado
- [ ] SkeletonCard/SkeletonList creados
- [ ] Try-catch SOLO en componentes
- [ ] useToastHandler usado para errores
- [ ] Ejemplos de uso documentados

### Testing
- [ ] `pnpm install` funciona
- [ ] `pnpm dev` levanta el proyecto
- [ ] `pnpm build` compila sin errores
- [ ] `pnpm type-check` pasa sin errores

---

## 📚 Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Type check
pnpm type-check

# Limpiar e instalar
pnpm clean

# Migrar hooks manualmente
pnpm migrate:hooks

# Verificar versiones
pnpm list react react-dom
```

---

## 🎯 Patrón de Manejo de Errores

### ❌ INCORRECTO - Try-catch en hooks

```typescript
// ❌ NO HACER ESTO
export function useApi<T>(fetcher: () => Promise<T>) {
  const fetchData = async () => {
    try {
      const result = await fetcher()
      setData(result)
    } catch (error) {
      setError(error)
    }
  }
}
```

### ✅ CORRECTO - Try-catch en componentes

```typescript
// ✅ Hook sin try-catch
export function useApi<T>(fetcher: () => Promise<T>) {
  const fetchData = async () => {
    const result = await fetcher()
    setData(result)
  }
}

// ✅ Componente con try-catch
function MyComponent() {
  const { data, refetch } = useApi(fetchUsers)
  const { showError } = useToastHandler()

  const handleClick = async () => {
    try {
      await refetch()
    } catch (error) {
      showError(error as Error)
    }
  }
}
```

---

## 🔧 Troubleshooting

### Error: Module not found después de migrar

```bash
# Limpiar y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: Type errors en hooks

```bash
# Verificar que todos los archivos sean .tsx
find src/hooks -name "*.jsx"

# Si encuentra archivos, renombrarlos
pnpm migrate:hooks
```

### Spinner no se muestra

```typescript
// Verificar que ChakraProvider esté en main.tsx
import { ChakraProvider } from '@chakra-ui/react'

<ChakraProvider>
  <App />
</ChakraProvider>
```

### useToast no funciona

```typescript
// Debe estar dentro de ChakraProvider
function MyComponent() {
  const { showError } = useToastHandler() // ✅ Correcto
}
```

---

## 📖 Documentación de Referencia

- **PNPM**: https://pnpm.io/
- **React 19**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Chakra UI**: https://chakra-ui.com/
- **Vite**: https://vitejs.dev/
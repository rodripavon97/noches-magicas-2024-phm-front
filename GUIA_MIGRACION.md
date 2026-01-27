# 🔄 Guía de Migración - Actualizar Código Existente

Esta guía te ayudará a actualizar el resto del código del proyecto para que use la nueva arquitectura.

## 📋 Checklist General

Para cada archivo que migres, verifica:

- [ ] Eliminar PropTypes
- [ ] Añadir interfaces TypeScript
- [ ] Cambiar extensión .jsx a .tsx
- [ ] Usar hooks en lugar de lógica directa
- [ ] Usar `getErrorMessage` para errores
- [ ] Eliminar `console.log` / `console.error`
- [ ] No usar `axios` directo

## 🔧 Pasos de Migración

### 1. Actualizar Imports

#### ❌ Antiguo

```typescript
import { usuarioService } from '../../service/usuarioService'
import { showService } from '../../service/showService'
import UseUser from '../../hooks/useUser.jsx'
import { useMessageToast } from '../../hooks/useToast'
```

#### ✅ Nuevo

```typescript
import { usuarioService, showService } from '../../services'
import { useAuth, useUsuario } from '../../hooks'
import { useToast } from '../../hooks'
import { getErrorMessage } from '../../errors'
```

### 2. Migrar Componentes

#### ❌ Componente Antiguo (con lógica)

```typescript
import { useState } from 'react'
import { usuarioService } from '../../service/usuarioService'

const MiComponente = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await usuarioService.getData()
      setData(result)
    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return <div>...</div>
}
```

#### ✅ Componente Nuevo (puro)

```typescript
import { useUsuario } from '../../hooks'
import { useToast } from '../../hooks'
import { getErrorMessage } from '../../errors'

const MiComponente = () => {
  const { usuario, loading } = useUsuario()
  const toast = useToast()

  // El loading y los datos vienen del hook
  // El componente solo renderiza

  if (loading) return <div>Cargando...</div>

  return <div>...</div>
}
```

### 3. Migrar Manejo de Errores

#### ❌ Antiguo

```typescript
try {
  await service.method()
} catch (error) {
  console.error(error)
  toast.error(error.message)
}
```

#### ✅ Nuevo

```typescript
try {
  await service.method()
  toast.success('Operación exitosa')
} catch (error) {
  toast.error(getErrorMessage(error))
}
```

### 4. Migrar Estado Global

#### ❌ Antiguo (useState + props drilling)

```typescript
// Componente Padre
const [user, setUser] = useState(null)

// Pasar por props a 5 niveles de profundidad
<ComponenteHijo user={user} setUser={setUser} />
```

#### ✅ Nuevo (Zustand)

```typescript
// Cualquier componente
import { useUsuario } from '../../hooks'

const { usuario, loading } = useUsuario()
// No necesitas props drilling
```

### 5. Migrar Formularios

#### ❌ Antiguo (sin validaciones)

```typescript
const handleSubmit = async () => {
  if (!username || !password) {
    alert('Campos vacíos')
    return
  }
  // ...
}
```

#### ✅ Nuevo (con validaciones)

```typescript
import { validateLoginForm, LoginForm } from '../../validations'
import { getErrorMessage } from '../../errors'

const handleSubmit = async () => {
  const form: LoginForm = { username, password }
  const validation = validateLoginForm(form)

  if (!validation.isValid) {
    toast.error(Object.values(validation.errors)[0])
    return
  }

  try {
    await login(username, password)
    toast.success('Login exitoso')
  } catch (error) {
    toast.error(getErrorMessage(error))
  }
}
```

### 6. Migrar Llamadas HTTP

#### ❌ Antiguo (axios directo)

```typescript
import axios from 'axios'

const getData = async () => {
  const response = await axios.get('http://localhost:8080/data')
  return response.data
}
```

#### ✅ Nuevo (httpClient)

```typescript
import { httpClient } from '../../api'

const getData = async () => {
  return httpClient.get<DataType>('/data')
}
```

### 7. Añadir Tipos TypeScript

#### ❌ Antiguo (sin tipos)

```typescript
const MiComponente = ({ data, onAction }) => {
  return <div onClick={onAction}>{data.name}</div>
}

MiComponente.propTypes = {
  data: PropTypes.object,
  onAction: PropTypes.func,
}
```

#### ✅ Nuevo (con tipos)

```typescript
interface MiComponenteProps {
  data: DataType
  onAction: () => void
}

const MiComponente = ({ data, onAction }: MiComponenteProps) => {
  return <div onClick={onAction}>{data.name}</div>
}
```

## 📝 Ejemplos Completos

### Ejemplo 1: Página de Listado

```typescript
// ✅ Página refactorizada correctamente

import { SimpleGrid, Text } from '@chakra-ui/react'
import { useShows } from '../../hooks'
import { useOnInit } from '../../hooks'
import { useToast } from '../../hooks'
import { getErrorMessage } from '../../errors'
import CardShow from '../../components/Card/Card'

const ListadoPage = () => {
  const { shows, loading, buscarShows } = useShows()
  const toast = useToast()

  useOnInit(() => {
    buscarShows().catch((error) => {
      toast.error(getErrorMessage(error))
    })
  })

  if (loading) return <Text>Cargando...</Text>

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={10}>
      {shows.map((show) => (
        <CardShow show={show} key={show.id} />
      ))}
    </SimpleGrid>
  )
}

export default ListadoPage
```

### Ejemplo 2: Formulario

```typescript
// ✅ Formulario refactorizado correctamente

import { useState } from 'react'
import { Input, Button, VStack } from '@chakra-ui/react'
import { useUsuario } from '../../hooks'
import { useToast } from '../../hooks'
import { validateEditUserForm, EditUserForm } from '../../validations'
import { getErrorMessage } from '../../errors'

const EditarPerfilForm = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const { editarDatos, loading } = useUsuario()
  const toast = useToast()

  const handleSubmit = async () => {
    const form: EditUserForm = { nombre, apellido }
    const validation = validateEditUserForm(form)

    if (!validation.isValid) {
      toast.error(Object.values(validation.errors)[0])
      return
    }

    try {
      await editarDatos(nombre, apellido)
      toast.success('Perfil actualizado')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <VStack>
      <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <Input value={apellido} onChange={(e) => setApellido(e.target.value)} />
      <Button onClick={handleSubmit} isLoading={loading}>
        Guardar
      </Button>
    </VStack>
  )
}

export default EditarPerfilForm
```

## 🎯 Prioridades de Migración

Migra en este orden:

1. **Alta Prioridad** (componentes que usan APIs):

   - Páginas principales
   - Componentes con formularios
   - Componentes con llamadas HTTP

2. **Media Prioridad** (componentes con lógica):

   - Componentes con validaciones
   - Componentes con transformación de datos

3. **Baja Prioridad** (componentes puros):
   - Componentes de presentación
   - Componentes sin estado

## ⚠️ Errores Comunes

### 1. Usar axios directo

```typescript
// ❌ NO HACER
import axios from 'axios'
await axios.get('/data')

// ✅ HACER
import { httpClient } from '../../api'
await httpClient.get('/data')
```

### 2. No validar formularios

```typescript
// ❌ NO HACER
if (!username) alert('Campo vacío')

// ✅ HACER
const validation = validateLoginForm({ username, password })
if (!validation.isValid) {
  toast.error(Object.values(validation.errors)[0])
}
```

### 3. console.log en producción

```typescript
// ❌ NO HACER
console.log('Usuario:', user)
console.error('Error:', error)

// ✅ HACER
// Eliminar todos los console.log
// Usar getErrorMessage para errores
toast.error(getErrorMessage(error))
```

### 4. Lógica en componentes

```typescript
// ❌ NO HACER
const Component = () => {
  const [data, setData] = useState([])
  const loadData = async () => {
    const result = await service.getData()
    setData(result)
  }
  // ...
}

// ✅ HACER
const Component = () => {
  const { data, loading } = useData()
  // El hook maneja la lógica
}
```

## 🧪 Testing

Después de migrar, verifica:

1. El componente renderiza correctamente
2. Los errores se muestran con toast
3. El loading state funciona
4. Las validaciones funcionan
5. No hay console.log en la consola

## 📚 Recursos

- Ver `ARQUITECTURA.md` para la documentación completa
- Ver `IMPLEMENTACION_COMPLETA.md` para ver ejemplos de código refactorizado
- Ver los hooks en `src/hooks/` para ver cómo usarlos

---

**¡Éxito con la migración!** 🚀

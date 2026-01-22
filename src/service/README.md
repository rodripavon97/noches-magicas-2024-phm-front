# 📋 Reglas de los Servicios

## ⚠️ IMPORTANTE: NO usar try-catch

Los servicios **NUNCA** deben tener `try-catch` en las llamadas HTTP. Los errores deben propagarse al componente/hook que los llama.

### ❌ MAL (NO HACER)

```typescript
async getUser(userId: number): Promise<UsuarioJSON> {
  try {
    const response = await axios.get(`${REST_SERVER_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // ❌ NO HACER
  }
}
```

### ✅ BIEN

```typescript
async getUser(userId: number): Promise<UsuarioJSON> {
  // Sin try-catch: el error se propaga automáticamente
  const response = await axios.get<UsuarioJSON>(`${REST_SERVER_URL}/user/${userId}`);
  return response.data;
}
```

## 🎯 ¿Dónde se manejan los errores?

### 1. En los Hooks (Recomendado)

```typescript
export function useUser(userId: number) {
  const [user, setUser] = useState<UsuarioJSON | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUser(userId); // ✅ Aquí capturamos el error
      setUser(data);
    } catch (err) {
      setError(err as Error); // ✅ Aquí manejamos el error
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
}
```

### 2. En los Componentes (con useToast)

```typescript
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  const { errorToast } = useMessageToast();

  // Mostrar error con toast
  useEffect(() => {
    if (error) {
      errorToast(error); // ✅ El componente decide cómo mostrar el error
    }
  }, [error, errorToast]);

  if (loading) return <Spinner />;
  
  return <div>{user?.name}</div>;
}
```

## 🔍 Manejo de Errores del Backend

Los errores de Axios incluyen información del backend:

```typescript
try {
  await userService.getUser(123);
} catch (error) {
  // error.response.data      → Mensaje del backend
  // error.response.status    → Código HTTP (404, 500, etc.)
  // error.response.headers   → Headers de la respuesta
  // error.message            → Mensaje de error
}
```

### Ejemplo con useToast

```typescript
const { errorToast } = useMessageToast();

try {
  await userService.updateUser(userId, updates);
  successToast('Usuario actualizado');
} catch (error) {
  // errorToast muestra automáticamente el mensaje del backend
  errorToast(error); 
  // Internamente maneja: error.response?.data?.message || error.message
}
```

## 📦 Estructura de un Servicio

```typescript
/**
 * Servicio de [nombre]
 * NO usa try-catch - Los errores se propagan
 */

import axios from 'axios';
import { REST_SERVER_URL } from './constant';

class MyService {
  // Método simple
  async getData(id: number): Promise<DataType> {
    const response = await axios.get<DataType>(`${REST_SERVER_URL}/data/${id}`);
    return response.data;
  }

  // Método con POST
  async createData(data: CreateDTO): Promise<DataType> {
    const response = await axios.post<DataType>(`${REST_SERVER_URL}/data`, data);
    return response.data;
  }

  // Método con parámetros complejos
  async searchData(params: SearchParams): Promise<DataType[]> {
    const queryParams = new URLSearchParams({
      q: params.query || '',
      page: String(params.page || 1),
    });
    
    const response = await axios.get<DataType[]>(`${REST_SERVER_URL}/search?${queryParams}`);
    return response.data;
  }

  // Método sin respuesta (void)
  async deleteData(id: number): Promise<void> {
    await axios.delete(`${REST_SERVER_URL}/data/${id}`);
  }
}

export const myService = new MyService();
```

## 🚨 Excepciones (Casos Especiales)

Solo usa `try-catch` para operaciones **NO HTTP**:

### ✅ Permitido: localStorage

```typescript
private saveToStorage(data: any): void {
  try {
    localStorage.setItem('key', JSON.stringify(data));
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
    // No re-lanzar el error - no es crítico
  }
}
```

### ✅ Permitido: JSON.parse

```typescript
getUserFromStorage(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null; // Si falla el parsing, retornar null
  }
}
```

## 📝 Resumen

| Operación | ¿Usar try-catch? | ¿Dónde? |
|-----------|------------------|---------|
| HTTP calls (axios) | ❌ NO | Hook o Componente |
| localStorage | ✅ SÍ | Servicio (operación local) |
| JSON.parse | ✅ SÍ | Servicio (operación local) |
| Validaciones | ❌ NO | Lanzar error directamente |
| Transformaciones | ❌ NO | Dejar que se propague |

## 🎯 Beneficios

1. ✅ **Consistencia**: Todos los errores se manejan igual
2. ✅ **Flexibilidad**: Cada componente decide cómo mostrar errores
3. ✅ **Testeable**: Fácil probar errores en tests
4. ✅ **Clean Code**: Servicios simples y directos
5. ✅ **UX**: useToast muestra errores del backend correctamente

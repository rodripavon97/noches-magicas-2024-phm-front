# 🚨 Manejo de Errores - Guía Completa

## 📋 Regla Principal

**Los servicios NUNCA usan try-catch en llamadas HTTP**. Los errores se propagan y se manejan en hooks/componentes.

## 🔄 Flujo de Errores

```
Backend → Axios → Service → Hook → Componente → useToast → Usuario
```

### Ejemplo Completo

#### 1. Backend responde con error

```json
// HTTP 400 Bad Request
{
  "message": "El usuario no tiene suficiente saldo",
  "status": 400
}
```

#### 2. Servicio propaga el error (sin try-catch)

```typescript
// ✅ src/service/userService.ts
class UserService {
  async checkout(userId: number): Promise<void> {
    // Sin try-catch - el error se propaga
    await axios.post(`${REST_SERVER_URL}/comprar-entradas/${userId}`);
  }
}
```

#### 3. Hook captura el error

```typescript
// ✅ src/hooks/useUsers.ts
export function useCart(userId: number) {
  const [error, setError] = useState<Error | null>(null);

  const checkout = useCallback(async () => {
    try {
      await userService.checkout(userId);
    } catch (err) {
      setError(err as Error); // ✅ Capturamos el error del servicio
      throw err; // Re-lanzamos para que el componente lo maneje
    }
  }, [userId]);

  return { checkout, error };
}
```

#### 4. Componente muestra el error con useToast

```typescript
// ✅ Componente
function Carrito() {
  const { userId } = UseUser();
  const { checkout } = useCart(userId);
  const { errorToast, successToast } = useMessageToast();

  const handleCheckout = async () => {
    try {
      await checkout();
      successToast('¡Compra exitosa!');
      navigate('/usuario');
    } catch (error) {
      errorToast(error); // ✅ useToast extrae el mensaje del backend
    }
  };

  return <Button onClick={handleCheckout}>Comprar</Button>;
}
```

#### 5. useToast procesa el error del backend

```typescript
// ✅ src/hooks/useToast.tsx
export const useMessageToast = () => {
  const errorToast = (error: any): void => {
    // Extrae el mensaje del backend
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    const mensajeError =
      status >= 500
        ? 'Ocurrió un error. Consulte al administrador del sistema'
        : message; // ✅ Muestra el mensaje del backend

    toast({
      description: mensajeError, // "El usuario no tiene suficiente saldo"
      status: 'error',
      position: 'bottom',
      isClosable: true,
      duration: 5000,
    });
  };
};
```

#### 6. Usuario ve el mensaje

```
┌─────────────────────────────────────┐
│ ⚠️ El usuario no tiene suficiente   │
│    saldo                            │
└─────────────────────────────────────┘
```

## 🎯 Diferentes Tipos de Errores

### Error 400 - Validación

```typescript
// Backend
{
  "message": "El email ya está registrado",
  "status": 400
}

// Usuario ve
"El email ya está registrado"
```

### Error 404 - No encontrado

```typescript
// Backend
{
  "message": "Show no encontrado",
  "status": 404
}

// Usuario ve
"Show no encontrado"
```

### Error 500 - Error del servidor

```typescript
// Backend
{
  "message": "Internal server error",
  "status": 500
}

// Usuario ve (genérico para no exponer detalles)
"Ocurrió un error. Consulte al administrador del sistema"
```

### Error de Red (sin conexión)

```typescript
// Axios error
{
  "message": "Network Error"
}

// Usuario ve
"Ocurrió un error al conectarse al backend. Consulte al administrador del sistema"
```

## ✅ Ejemplos Correctos

### Ejemplo 1: Login con error

```typescript
// Servicio
async login(credentials: LoginDTO): Promise<UsuarioJSON> {
  const response = await axios.post(`${REST_SERVER_URL}/usuario-logueado`, credentials);
  return response.data;
}

// Hook
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (credentials: LoginDTO) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await authService.login(credentials);
      return userData;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}

// Componente
function LoginPage() {
  const { login, loading } = useLogin();
  const { errorToast, successToast } = useMessageToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login({ username, password });
      successToast("Login Exitoso");
      navigate('/busqueda');
    } catch (error) {
      errorToast(error); // Muestra: "Credenciales inválidas"
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Ejemplo 2: Actualizar perfil

```typescript
// Servicio
async updateUser(userId: number, updates: UsuarioEditarDTO): Promise<UsuarioJSON> {
  const response = await axios.patch(`${REST_SERVER_URL}/editar-datos-usuario/${userId}`, updates);
  return response.data;
}

// Hook
export function useUpdateUser(userId: number) {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = useCallback(async (updates: UsuarioEditarDTO) => {
    setUpdating(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(userId, updates);
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [userId]);

  return { updateUser, updating, error };
}

// Componente
function UserProfile({ userId }) {
  const { updateUser, updating } = useUpdateUser(userId);
  const { errorToast, successToast } = useMessageToast();

  const handleSave = async (data) => {
    try {
      await updateUser(data);
      successToast('Perfil actualizado correctamente');
    } catch (error) {
      errorToast(error); // Muestra el error del backend
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Button type="submit" isLoading={updating}>
        Guardar
      </Button>
    </form>
  );
}
```

### Ejemplo 3: Eliminar amigo

```typescript
// Servicio
async removeFriend(userId: number, friendId: number): Promise<void> {
  await axios.put(`${REST_SERVER_URL}/quitar-amigo/${userId}/${friendId}`);
}

// Hook
export function useUserFriends(userId: number) {
  const [friends, setFriends] = useState<UsuarioJSON[]>([]);

  const removeFriend = useCallback(async (friendId: number) => {
    try {
      await userService.removeFriend(userId, friendId);
      setFriends(prev => prev.filter(f => f.id !== friendId));
    } catch (err) {
      setError(err as Error);
      throw err; // Re-lanzar para que el componente lo maneje
    }
  }, [userId]);

  return { friends, removeFriend };
}

// Componente
function FriendCard({ friend, userId }) {
  const { removeFriend } = useUserFriends(userId);
  const { errorToast, successToast } = useMessageToast();

  const handleRemove = async () => {
    try {
      await removeFriend(friend.id);
      successToast(`${friend.nombre} eliminado de amigos`);
    } catch (error) {
      errorToast(error); // "No se puede eliminar este amigo"
    }
  };

  return <Button onClick={handleRemove}>Eliminar</Button>;
}
```

## ❌ Ejemplos INCORRECTOS

### ❌ Try-catch en el servicio

```typescript
// ❌ MAL
async getUser(userId: number): Promise<UsuarioJSON> {
  try {
    const response = await axios.get(`${REST_SERVER_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error:', error); // ❌ NO hacer esto
    throw error;
  }
}
```

### ❌ No mostrar el error al usuario

```typescript
// ❌ MAL
const handleSubmit = async () => {
  try {
    await login(credentials);
  } catch (error) {
    console.error(error); // ❌ El usuario no ve nada
  }
};
```

### ❌ Mensaje genérico en lugar del error del backend

```typescript
// ❌ MAL
catch (error) {
  errorToast('Ocurrió un error'); // ❌ Ignora el mensaje del backend
}

// ✅ BIEN
catch (error) {
  errorToast(error); // ✅ useToast extrae el mensaje del backend
}
```

## 📝 Checklist

Al crear un nuevo feature:

- [ ] ✅ Servicio sin try-catch en llamadas HTTP
- [ ] ✅ Hook captura el error con try-catch
- [ ] ✅ Hook re-lanza el error con `throw err`
- [ ] ✅ Componente captura el error con try-catch
- [ ] ✅ Componente muestra el error con `errorToast(error)`
- [ ] ✅ Loading states mientras se procesa
- [ ] ✅ Mensajes de éxito con `successToast`

## 🎯 Resumen

| Capa | Responsabilidad | Try-Catch |
|------|----------------|-----------|
| **Servicio** | Llamar al backend | ❌ NO |
| **Hook** | Estado y lógica | ✅ SÍ |
| **Componente** | UI y UX | ✅ SÍ |
| **useToast** | Mostrar errores | N/A |

**Flujo**: Backend → Service (propagación) → Hook (captura) → Componente (manejo) → useToast (UI)

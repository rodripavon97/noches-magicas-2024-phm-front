# Estructura Simplificada del Proyecto

## 📁 Estructura de Servicios

La arquitectura del proyecto ha sido simplificada para mayor claridad y facilidad de uso:

```
src/
├── service/
│   ├── authService.ts        # 🔐 Autenticación (login, logout)
│   ├── userService.ts        # 👤 Usuarios (perfil, amigos, carrito)
│   ├── showServiceNew.ts     # 🎭 Shows (consulta, admin)
│   ├── loggingService.ts     # 📊 Logging de eventos
│   └── constant.ts           # 🔧 Constantes (URL base)
├── hooks/
│   ├── useAuth.ts           # Hooks de autenticación
│   ├── useUsers.ts          # Hooks de usuarios
│   ├── useShows.ts          # Hooks de shows
│   └── index.ts             # Exportaciones
└── types/
    └── services.ts          # Tipos TypeScript
```

## ✅ Beneficios de esta Estructura

1. **Más simple**: Sin carpetas anidadas innecesarias
2. **Directo**: Los servicios están en `src/service/` directamente
3. **Fácil de entender**: Cada archivo tiene un propósito claro
4. **Mantenible**: No hay abstracciones complejas

## 🚀 Cómo Usar

### Servicios Directos (NO RECOMENDADO)

```typescript
import { authService } from '@/service/authService';
import { userService } from '@/service/userService';
import { showServiceNew as showService } from '@/service/showServiceNew';

// Usar directamente
const user = await authService.login({ username, password });
```

### Hooks Personalizados (RECOMENDADO) ✅

```typescript
import { useLogin, useUser, useShows } from '@/hooks';

function MyComponent() {
  // Hook de login
  const { login, loading, error } = useLogin();
  
  // Hook de usuario
  const { user, loading, refetch } = useUser(userId);
  
  // Hook de shows
  const { shows, loading, refetch } = useShows({ artista: 'Arctic Monkeys' });
}
```

## 📦 Servicios Disponibles

### 🔐 AuthService

**Archivo**: `src/service/authService.ts`

```typescript
// Métodos
login(credentials: LoginDTO): Promise<UsuarioJSON>
logout(): Promise<void>
getCurrentUser(): Promise<UsuarioJSON | null>
isAuthenticated(): boolean
getUserId(): number | null
isAdmin(): boolean
```

### 👤 UserService

**Archivo**: `src/service/userService.ts`

```typescript
// Usuario
getUser(userId: number): Promise<UsuarioJSON>
updateUser(userId: number, updates: UsuarioEditarDTO): Promise<UsuarioJSON>

// Amigos
getUserFriends(userId: number): Promise<UsuarioJSON[]>
addFriend(userId: number, friendId: number): Promise<void>
removeFriend(userId: number, friendId: number): Promise<void>

// Carrito
getCart(userId: number): Promise<CarritoJSON[]>
addToCart(userId: number, item: CarritoGetDTO): Promise<void>
clearCart(userId: number): Promise<void>
checkout(userId: number): Promise<void>

// Entradas
getPurchasedTickets(userId: number): Promise<ShowJSON[]>

// Comentarios
getUserComments(userId: number): Promise<ComentarioJSON[]>
addComment(showId: string, userId: number, comment: ComentarioNuevoDTO): Promise<void>
deleteComment(userId: number, showId: string): Promise<void>

// Saldo
addCredits(userId: number, amount: number): Promise<void>
```

### 🎭 ShowService

**Archivo**: `src/service/showServiceNew.ts`

```typescript
// Consulta
getShows(params: GetShowsParams): Promise<ShowJSON[]>
getShowById(id: string): Promise<ShowJSON>
getShowDetail(id: string): Promise<ShowDetalle>
searchShows(query: string): Promise<ShowJSON[]>
getShowsByLocation(location: string): Promise<ShowJSON[]>

// Admin
getShowsAdmin(params: GetShowsAdminParams): Promise<ShowJSON[]>
createShow(showData: Partial<ShowJSON>): Promise<ShowJSON>
updateShow(id: string, updates: EditarShowData): Promise<void>
deleteShow(id: string): Promise<void>
addNewFunction(showId: string, functionData: NuevaFuncionData): Promise<void>

// Lista de espera
addToWaitingList(showId: string, userId: number): Promise<void>

// Logging
registerClickLog(showId: string, userId: string, payload: any): Promise<void>
```

## 🎯 Mejores Prácticas

### ✅ DO: Usar Hooks

```typescript
import { useUser, useUpdateUser } from '@/hooks';

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  const { updateUser, updating } = useUpdateUser(userId);

  const handleSave = async (data) => {
    await updateUser(data);
  };

  if (loading) return <Spinner />;
  if (error) return <Error error={error} />;

  return <UserForm user={user} onSave={handleSave} />;
}
```

### ❌ DON'T: Usar Servicios Directamente en Componentes

```typescript
import { userService } from '@/service/userService';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    userService.getUser(userId).then(setUser); // ❌ NO HACER
  }, [userId]);
}
```

## 📝 Resumen de Cambios

### Antes

- ❌ Carpetas: `abstractions/`, `infrastructure/`, `refactored/`, `core/`
- ❌ Archivos: `IHttpClient.ts`, `AxiosHttpClient.ts`, `*.refactored.ts`
- ❌ Complejo: Dependency Injection, abstracciones múltiples

### Ahora

- ✅ Simple: Servicios directamente en `src/service/`
- ✅ Directo: `authService.ts`, `userService.ts`, `showServiceNew.ts`
- ✅ Claro: Un archivo = un servicio

## 🔄 Migración

Si encuentras código antiguo:

```typescript
// ❌ Antiguo
import { usuarioService } from '@/service/usuarioService';
await usuarioService.getInfoUsuario();

// ✅ Nuevo
import { userService } from '@/service/userService';
await userService.getUser(userId);
```

```typescript
// ❌ Antiguo
import { showService } from '@/service/showService';

// ✅ Nuevo  
import { showServiceNew as showService } from '@/service/showServiceNew';
```

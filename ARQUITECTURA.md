# Arquitectura del Proyecto - Noches Mágicas

Este documento explica la arquitectura del proyecto siguiendo los principios de **Clean Code** y **SOLID**.

## 📁 Estructura de Carpetas

```
src/
├── service/                      # Capa de servicios
│   ├── authService.ts           # Servicio de autenticación
│   ├── userService.ts           # Servicio de usuarios
│   ├── showServiceNew.ts        # Servicio de shows
│   ├── loggingService.ts        # Servicio de logging
│   └── constant.ts              # Constantes (URL base)
├── hooks/                       # Custom hooks
│   ├── useAuth.ts              # Hooks de autenticación
│   ├── useUsers.ts             # Hooks de usuarios
│   ├── useShows.ts             # Hooks de shows
│   └── index.ts                # Exportación centralizada
├── types/                       # Tipos TypeScript
│   └── services.ts             # Interfaces de servicios
└── domain/                      # Modelos de dominio
    ├── Usuario.ts
    ├── Show.ts
    └── ...
```

## 🏗️ Principios SOLID Aplicados

### 1. Single Responsibility Principle (SRP)

Cada servicio tiene **una única responsabilidad**:

- `AuthService`: Solo maneja autenticación (login, logout, verificación)
- `UserService`: Solo maneja operaciones de usuario (perfil, amigos, carrito)
- `ShowService`: Solo maneja operaciones de shows (consulta, búsqueda, admin)

### 2. Dependency Inversion Principle (DIP)

Los servicios **dependen de abstracciones**, no de implementaciones:

```typescript
// ❌ MAL - Dependencia directa de axios
class UserService {
  async getUser(id: number) {
    return axios.get(`/user/${id}`);
  }
}

// ✅ BIEN - Dependencia de abstracción
class UserService {
  constructor(private httpClient: IHttpClient) {}
  
  async getUser(id: number) {
    return this.httpClient.get(`/user/${id}`);
  }
}
```

### 3. Open/Closed Principle (OCP)

Los servicios están **abiertos para extensión, cerrados para modificación**:

```typescript
// Puedes cambiar la implementación del cliente HTTP sin modificar los servicios
const axiosClient = new AxiosHttpClient();
const fetchClient = new FetchHttpClient(); // Futura implementación

export const userService = new UserService(axiosClient);
```

## 📦 Uso de Servicios

### 1. Importar los Servicios

Los servicios están disponibles directamente:

```typescript
import { authService } from '@/service/authService';
import { userService } from '@/service/userService';
import { showServiceNew as showService } from '@/service/showServiceNew';
```

### 2. Usar directamente en componentes (NO RECOMENDADO)

```typescript
// ❌ NO recomendado - lógica directa en componente
function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    userService.getUser(123).then(setUser);
  }, []);
  
  return <div>{user?.name}</div>;
}
```

### 3. Usar hooks personalizados (RECOMENDADO) ✅

```typescript
// ✅ Recomendado - usar hooks
import { useUser } from '@/hooks';

function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{user?.name}</div>;
}
```

## 🎣 Hooks Disponibles

### Autenticación

```typescript
import { useAuth, useLogin, useLogout, useCurrentUser } from '@/hooks';

// Hook completo de autenticación
const { user, isAuthenticated, login, logout } = useAuth();

// Hook solo para login
const { login, loading, error } = useLogin();

// Hook solo para logout
const { logout, loading } = useLogout();

// Hook para obtener usuario actual
const { user, loading, refetch } = useCurrentUser();
```

### Usuarios

```typescript
import { 
  useUser, 
  useUserFriends, 
  useUpdateUser,
  useCart,
  useUserComments,
  usePurchasedTickets,
  useAddCredits,
} from '@/hooks';

// Obtener usuario
const { user, loading, error, refetch } = useUser(userId);

// Obtener amigos
const { friends, loading, removeFriend } = useUserFriends(userId);

// Actualizar usuario
const { updateUser, updating, error } = useUpdateUser(userId);
await updateUser({ nombre: 'Juan', apellido: 'Pérez' });

// Gestión de carrito
const { cart, loading, addToCart, clearCart, checkout } = useCart(userId);

// Comentarios del usuario
const { comments, addComment, deleteComment } = useUserComments(userId);

// Entradas compradas
const { tickets, loading, refetch } = usePurchasedTickets(userId);

// Agregar créditos
const { addCredits, loading } = useAddCredits(userId);
await addCredits(1000);
```

### Shows

```typescript
import {
  useShows,
  useShow,
  useSearchShows,
  useShowsByLocation,
  useShowsAdmin,
  useUpdateShow,
  useDeleteShow,
  useAddFunction,
  useWaitingList,
} from '@/hooks';

// Obtener lista de shows
const { shows, loading, refetch } = useShows({ 
  artista: 'Arctic Monkeys',
  location: 'Buenos Aires',
  conAmigos: true,
  userId: 123,
});

// Obtener detalle de un show
const { show, loading, error, refetch } = useShow(showId);

// Buscar shows
const { shows, loading, search } = useSearchShows();
await search('Arctic');

// Shows por ubicación
const { shows, fetchByLocation } = useShowsByLocation();
await fetchByLocation('Buenos Aires');

// Shows para admin
const { shows, loading, refetch } = useShowsAdmin({ 
  artista: '',
  location: '',
});

// Actualizar show (admin)
const { updateShow, updating } = useUpdateShow();
await updateShow(showId, { 
  nombreBanda: 'Arctic Monkeys',
  nombreShow: 'AM Tour 2024',
});

// Eliminar show (admin)
const { deleteShow, deleting } = useDeleteShow();
await deleteShow(showId);

// Agregar función (admin)
const { addFunction, adding } = useAddFunction();
await addFunction(showId, {
  fecha: '2024-06-15',
  hora: '21:00',
});

// Lista de espera
const { addToWaitingList, adding } = useWaitingList();
await addToWaitingList(showId, userId);
```

## 🎯 Ejemplos de Uso

### Ejemplo 1: Login

```typescript
import { useLogin } from '@/hooks';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login({ 
        username: 'user@example.com',
        password: '123456',
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} />}
    </form>
  );
}
```

### Ejemplo 2: Lista de Shows con Filtros

```typescript
import { useShows } from '@/hooks';

function ShowList() {
  const [filters, setFilters] = useState({
    artista: '',
    location: '',
    conAmigos: false,
  });

  const { shows, loading, error, refetch } = useShows(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    refetch(newFilters);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <Filters onChange={handleFilterChange} />
      <div className="grid">
        {shows.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
}
```

### Ejemplo 3: Perfil de Usuario

```typescript
import { useUser, useUpdateUser } from '@/hooks';

function UserProfile({ userId }) {
  const { user, loading, error, refetch } = useUser(userId);
  const { updateUser, updating } = useUpdateUser(userId);

  const handleUpdate = async (data) => {
    try {
      await updateUser(data);
      refetch(); // Recargar usuario actualizado
    } catch (err) {
      console.error('Error al actualizar:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>{user.nombre} {user.apellido}</h1>
      <UserForm 
        user={user} 
        onSubmit={handleUpdate} 
        loading={updating}
      />
    </div>
  );
}
```

### Ejemplo 4: Carrito de Compras

```typescript
import { useCart } from '@/hooks';
import UseUser from '@/hooks/useUserStore';

function ShoppingCart() {
  const { userId } = UseUser();
  const { cart, loading, addToCart, clearCart, checkout } = useCart(userId);

  const handleCheckout = async () => {
    try {
      await checkout();
      alert('¡Compra exitosa!');
    } catch (err) {
      alert('Error al procesar la compra');
    }
  };

  return (
    <div>
      <h2>Mi Carrito</h2>
      {loading && <Spinner />}
      
      {cart.map(item => (
        <CartItem key={item.id} item={item} />
      ))}

      <button onClick={handleCheckout}>
        Comprar
      </button>
      
      <button onClick={clearCart}>
        Vaciar Carrito
      </button>
    </div>
  );
}
```

## 🔄 Migración desde Servicios Antiguos

Si tienes código usando los servicios antiguos, así es cómo migrarlos:

### Antes (❌)

```typescript
import { usuarioService } from '@/service/usuarioService';
import { showService } from '@/service/showService';

// En componente
const [user, setUser] = useState(null);

useEffect(() => {
  usuarioService.getInfoUsuario().then(setUser);
}, []);
```

### Después (✅)

```typescript
import { useCurrentUser } from '@/hooks';

// En componente
const { user, loading, error } = useCurrentUser();
```

## 📝 Ventajas de esta Arquitectura

1. **Separación de responsabilidades**: Cada capa tiene su función específica
2. **Testeable**: Los servicios pueden probarse independientemente
3. **Mantenible**: Código organizado y fácil de modificar
4. **Escalable**: Fácil agregar nuevos servicios o hooks
5. **Type-safe**: TypeScript garantiza tipos correctos
6. **Reutilizable**: Los hooks se pueden usar en cualquier componente

## 🚀 Próximos Pasos

- [ ] Migrar todos los componentes a usar los nuevos hooks
- [ ] Eliminar servicios antiguos una vez migrados
- [ ] Agregar tests unitarios para servicios
- [ ] Documentar casos de uso específicos del proyecto

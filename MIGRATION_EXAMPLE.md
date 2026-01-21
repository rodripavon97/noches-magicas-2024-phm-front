# 📝 Ejemplo de Migración Paso a Paso

Este documento muestra cómo migrar un componente existente a la nueva arquitectura refactorizada.

---

## Ejemplo: Migrar página de Usuario

### ❌ ANTES: `Usuario.tsx` (sin refactorizar)

```tsx
import { useState, useEffect } from 'react';
import UseUser from '../../hooks/useUser';
import { usuarioService } from '../../service/usuarioService';

const Usuario = () => {
  const { user, isLoggedIn } = UseUser();
  const [entradas, setEntradas] = useState([]);
  const [amigos, setAmigos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const entradasData = await usuarioService.getEntradasCompradas();
      const amigosData = await usuarioService.getAmigos();
      setEntradas(entradasData);
      setAmigos(amigosData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuitarAmigo = async (amigoId: number) => {
    try {
      await usuarioService.quitarAmigo(amigoId);
      fetchData(); // Refetch
    } catch (error) {
      console.error(error);
    }
  };

  if (!isLoggedIn) return <div>No autorizado</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Perfil de {user.nombre} {user.apellido}</h1>
      <img src={user.fotoPerfil} alt="Avatar" />
      
      <h2>Mis Entradas</h2>
      {entradas.map(entrada => (
        <div key={entrada.id}>
          {entrada.nombreBanda} - ${entrada.precioEntrada}
        </div>
      ))}
      
      <h2>Mis Amigos</h2>
      {amigos.map(amigo => (
        <div key={amigo.id}>
          {amigo.nombre} {amigo.apellido}
          <button onClick={() => handleQuitarAmigo(amigo.id)}>
            Quitar
          </button>
        </div>
      ))}
    </div>
  );
};

export default Usuario;
```

---

### ✅ DESPUÉS: `Usuario.refactored.tsx`

#### Paso 1: Crear componentes pequeños

**`UserProfileHeader.tsx`**
```tsx
import { Avatar, Heading, VStack } from '@chakra-ui/react';

interface UserProfileHeaderProps {
  userName: string;
  userAvatar: string;
}

export const UserProfileHeader = ({ userName, userAvatar }: UserProfileHeaderProps) => {
  return (
    <VStack spacing={4}>
      <Avatar src={userAvatar} size="2xl" />
      <Heading size="lg">Perfil de {userName}</Heading>
    </VStack>
  );
};
```

**`UserTicketsList.tsx`**
```tsx
import { VStack, Heading } from '@chakra-ui/react';
import { Show } from '@/domain/Show';
import CardShow from '@/components/Card/Card.refactored';

interface UserTicketsListProps {
  tickets: Show[];
  onRefresh?: () => void;
}

export const UserTicketsList = ({ tickets, onRefresh }: UserTicketsListProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md">Mis Entradas</Heading>
      {tickets.length === 0 ? (
        <p>No tienes entradas compradas</p>
      ) : (
        tickets.map(ticket => (
          <CardShow 
            key={ticket.id} 
            show={ticket}
            estaEnPerfil={true}
            mostrarCantidadEntrada={false}
            onComentarioPublicado={onRefresh}
          />
        ))
      )}
    </VStack>
  );
};
```

**`UserFriendsList.tsx`**
```tsx
import { VStack, HStack, Avatar, Text, IconButton, Heading } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { Usuario } from '@/domain/Usuario';

interface UserFriendsListProps {
  friends: Usuario[];
  onRemoveFriend: (friendId: number) => void;
}

export const UserFriendsList = ({ friends, onRemoveFriend }: UserFriendsListProps) => {
  return (
    <VStack spacing={4} align="stretch">
      <Heading size="md">Mis Amigos</Heading>
      {friends.length === 0 ? (
        <p>No tienes amigos agregados</p>
      ) : (
        friends.map(friend => (
          <HStack key={friend.id} justify="space-between" p={2} borderWidth={1} borderRadius="md">
            <HStack>
              <Avatar src={friend.fotoPerfil} size="sm" />
              <Text>{friend.nombre} {friend.apellido}</Text>
            </HStack>
            <IconButton
              icon={<FaTrash />}
              aria-label="Quitar amigo"
              size="sm"
              colorScheme="red"
              onClick={() => onRemoveFriend(friend.id)}
            />
          </HStack>
        ))
      )}
    </VStack>
  );
};
```

#### Paso 2: Crear custom hook para lógica

**`useUserProfile.ts`**
```tsx
import { useState, useEffect } from 'react';
import { useUserStore, selectUserId, selectIsLoggedIn } from '@/hooks/useUserStore';
import { userServiceRefactored } from '@/service/ServiceFactory';
import { Show } from '@/domain/Show';
import { Usuario } from '@/domain/Usuario';

export const useUserProfile = () => {
  const userId = useUserStore(selectUserId);
  const isLoggedIn = useUserStore(selectIsLoggedIn);
  
  const [tickets, setTickets] = useState<Show[]>([]);
  const [friends, setFriends] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [ticketsData, friendsData] = await Promise.all([
        userServiceRefactored.getPurchasedTickets(userId),
        userServiceRefactored.getUserFriends(userId),
      ]);
      
      // Mapear a domain objects
      setTickets(ticketsData.map(Show.fromJSON));
      setFriends(friendsData.map(Usuario.fromJSON));
    } catch (err) {
      setError('Error al cargar datos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendId: number) => {
    if (!userId) return;
    
    try {
      await userServiceRefactored.removeFriend(userId, friendId);
      // Actualizar estado local
      setFriends(prev => prev.filter(f => f.id !== friendId));
    } catch (err) {
      console.error('Error al quitar amigo:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn, userId]);

  return {
    tickets,
    friends,
    loading,
    error,
    refetch: fetchUserData,
    removeFriend,
  };
};
```

#### Paso 3: Componente principal refactorizado

**`Usuario.refactored.tsx`**
```tsx
import { Box, Container, VStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import { useUserStore, selectIsLoggedIn, selectUserName, selectUserAvatar } from '@/hooks/useUserStore';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfileHeader } from '@/components/PerfilUsuario/UserProfileHeader';
import { UserTicketsList } from '@/components/PerfilUsuario/UserTicketsList';
import { UserFriendsList } from '@/components/PerfilUsuario/UserFriendsList';

/**
 * Página de perfil de usuario refactorizada
 * 
 * Principios SOLID aplicados:
 * - SRP: Separado en componentes pequeños
 * - DIP: Usa servicios abstractos
 * - OCP: Extensible mediante props
 */
const Usuario = () => {
  const isLoggedIn = useUserStore(selectIsLoggedIn);
  const userName = useUserStore(selectUserName);
  const userAvatar = useUserStore(selectUserAvatar);
  
  const { tickets, friends, loading, error, refetch, removeFriend } = useUserProfile();

  // Protected route
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Loading state
  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container py={10}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <UserProfileHeader 
          userName={userName} 
          userAvatar={userAvatar} 
        />
        
        <UserTicketsList 
          tickets={tickets} 
          onRefresh={refetch}
        />
        
        <UserFriendsList 
          friends={friends}
          onRemoveFriend={removeFriend}
        />
      </VStack>
    </Container>
  );
};

export default Usuario;
```

---

## 📊 Comparación

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Líneas de código** | 100+ en 1 archivo | 4 archivos de ~30 líneas |
| **Responsabilidades** | Todo en uno | 1 por componente |
| **Testeable** | Difícil | Fácil |
| **Reutilizable** | No | Sí |
| **Type Safety** | Parcial | 100% |
| **Performance** | Re-renders innecesarios | Optimizado con selectores |

---

## 🎯 Beneficios de la Refactorización

### 1. **Componentes más pequeños y enfocados**
```tsx
// Cada componente hace UNA cosa
<UserProfileHeader />  // Solo muestra header
<UserTicketsList />    // Solo muestra tickets
<UserFriendsList />    // Solo muestra amigos
```

### 2. **Lógica separada en hooks**
```tsx
// Lógica reutilizable
const { tickets, friends, removeFriend } = useUserProfile();
```

### 3. **Servicios con abstracción**
```tsx
// Fácil de mockear en tests
await userServiceRefactored.getUserFriends(userId);
```

### 4. **Type Safety completo**
```tsx
// TypeScript te ayuda en todo momento
interface UserFriendsListProps {
  friends: Usuario[];
  onRemoveFriend: (friendId: number) => void;
}
```

### 5. **Selectores para performance**
```tsx
// Solo re-renderiza cuando cambia userName
const userName = useUserStore(selectUserName);
```

---

## 🧪 Testing Example

Con la nueva estructura, los tests son mucho más fáciles:

```tsx
import { render, screen } from '@testing-library/react';
import { UserFriendsList } from './UserFriendsList';

describe('UserFriendsList', () => {
  const mockFriends = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', fotoPerfil: 'url' },
    { id: 2, nombre: 'María', apellido: 'García', fotoPerfil: 'url' },
  ];

  it('should render friends list', () => {
    render(
      <UserFriendsList 
        friends={mockFriends} 
        onRemoveFriend={jest.fn()} 
      />
    );
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  it('should call onRemoveFriend when button clicked', () => {
    const mockRemove = jest.fn();
    render(
      <UserFriendsList 
        friends={mockFriends} 
        onRemoveFriend={mockRemove} 
      />
    );
    
    const removeButtons = screen.getAllByLabelText('Quitar amigo');
    fireEvent.click(removeButtons[0]);
    
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
```

---

## ✅ Checklist de Refactorización

Al refactorizar un componente, asegúrate de:

- [ ] Componentes < 100 líneas
- [ ] Una responsabilidad por componente
- [ ] Props con tipos TypeScript
- [ ] Usar selectores de Zustand
- [ ] Servicios en lugar de fetch directo
- [ ] Custom hooks para lógica reutilizable
- [ ] Nombres descriptivos
- [ ] Manejo de estados (loading, error, success)
- [ ] Tests unitarios
- [ ] Documentación con JSDoc

---

**¡Ahora es tu turno! Aplica estos principios a tus componentes. 🚀**

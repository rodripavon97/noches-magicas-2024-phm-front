# Agent React - Clean Code & SOLID

## ⚛️ Principios de Clean Code en React

### Componentes pequeños y enfocados

```tsx
// ❌ Malo - componente monolítico
function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    // fetch logic
  };
  
  return (
    <div>
      {/* 200+ líneas de JSX */}
    </div>
  );
}

// ✅ Bueno - componentes separados
function UserDashboard() {
  return (
    <div className="dashboard">
      <UserHeader />
      <UserFilters />
      <UserTable />
      <UserStats />
    </div>
  );
}

function UserTable() {
  const users = useUsers();
  
  if (users.loading) return <LoadingSpinner />;
  if (users.error) return <ErrorMessage error={users.error} />;
  
  return (
    <table>
      {users.data.map(user => (
        <UserRow key={user.id} user={user} />
      ))}
    </table>
  );
}
```

### Nombres descriptivos

```tsx
// ❌ Malo
const handleClick = () => {};
const data = useData();
const isValid = check();

// ✅ Bueno
const handleUserSubmit = () => {};
const userData = useUserData();
const isEmailValid = validateEmail();
```

### Custom Hooks para lógica reutilizable

```tsx
// ❌ Malo - lógica duplicada en componentes
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/user')
      .then(res => res.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
  
  // ...
}

// ✅ Bueno - custom hook reutilizable
function useUser(userId?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    
    setLoading(true);
    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}

// Uso
function UserProfile({ userId }: { userId: string }) {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return <div>{user?.name}</div>;
}
```

---

## 🏗️ SOLID en React

### 1. Single Responsibility Principle (SRP)

**Un componente debe hacer una sola cosa.**

```tsx
// ❌ Malo - múltiples responsabilidades
function UserProfile() {
  // Fetch data
  const [user, setUser] = useState(null);
  
  // Handle form
  const [editing, setEditing] = useState(false);
  
  // Handle modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Render everything
  return (
    <div>
      {/* Avatar, info, form, modal, actions */}
    </div>
  );
}

// ✅ Bueno - responsabilidades separadas
function UserProfile({ userId }: { userId: string }) {
  const { user, loading } = useUser(userId);
  
  if (loading) return <LoadingSkeleton />;
  
  return (
    <div className="profile">
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions userId={userId} />
    </div>
  );
}

function UserAvatar({ user }: { user: User }) {
  return (
    <img 
      src={user.avatar} 
      alt={user.name}
      className="w-24 h-24 rounded-full"
    />
  );
}

function UserInfo({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.bio}</p>
    </div>
  );
}

function UserActions({ userId }: { userId: string }) {
  const navigate = useNavigate();
  
  return (
    <div className="actions">
      <button onClick={() => navigate(`/users/${userId}/edit`)}>
        Edit
      </button>
      <DeleteUserButton userId={userId} />
    </div>
  );
}
```

### 2. Open/Closed Principle (OCP)

**Abierto para extensión, cerrado para modificación.**

```tsx
// ❌ Malo - necesitas modificar para agregar variantes
function Button({ type, children }) {
  if (type === 'primary') {
    return <button className="bg-blue-500">{children}</button>;
  }
  if (type === 'danger') {
    return <button className="bg-red-500">{children}</button>;
  }
  // Necesitas modificar para agregar más tipos
}

// ✅ Bueno - extensible mediante props
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors';
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

// Extensión sin modificar el componente original
function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="primary" {...props} />;
}

function DangerButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="danger" {...props} />;
}
```

### 3. Liskov Substitution Principle (LSP)

**Los componentes derivados deben ser intercambiables.**

```tsx
// ❌ Malo - rompe el contrato
interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

function TextInput({ value, onChange }: InputProps) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

function NumberInput({ value, onChange }: InputProps) {
  // Rompe el contrato - espera string pero necesita number
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value).toString()); // Conversión extraña
  };
  
  return <input type="number" value={value} onChange={handleChange} />;
}

// ✅ Bueno - contratos específicos pero consistentes
interface BaseInputProps<T> {
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
}

function TextInput({ value, onChange, ...props }: BaseInputProps<string>) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      {...props}
    />
  );
}

function NumberInput({ value, onChange, ...props }: BaseInputProps<number>) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      {...props}
    />
  );
}

// Componente genérico que funciona con cualquier input
function FormField<T>({
  label,
  input,
}: {
  label: string;
  input: React.ReactElement<BaseInputProps<T>>;
}) {
  return (
    <div className="form-field">
      <label>{label}</label>
      {input}
    </div>
  );
}
```

### 4. Interface Segregation Principle (ISP)

**Interfaces específicas mejor que una general.**

```tsx
// ❌ Malo - interfaz demasiado grande
interface UserComponentProps {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  showAvatar?: boolean;
  showEmail?: boolean;
  showBio?: boolean;
  editable?: boolean;
  deletable?: boolean;
}

function UserCard(props: UserComponentProps) {
  // Componente confuso con demasiadas props opcionales
}

// ✅ Bueno - interfaces segregadas
interface UserDisplayProps {
  user: User;
}

interface UserAvatarProps {
  user: Pick<User, 'avatar' | 'name'>;
  size?: 'sm' | 'md' | 'lg';
}

interface UserActionsProps {
  userId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

function UserCard({ user }: UserDisplayProps) {
  return (
    <div className="card">
      <UserAvatar user={user} size="md" />
      <UserInfo user={user} />
    </div>
  );
}

function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  return (
    <img
      src={user.avatar}
      alt={user.name}
      className={`rounded-full ${sizes[size]}`}
    />
  );
}

function UserActions({ userId, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="actions">
      {onEdit && <button onClick={onEdit}>Edit</button>}
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  );
}
```

### 5. Dependency Inversion Principle (DIP)

**Depender de abstracciones, no de implementaciones.**

```tsx
// ❌ Malo - dependencia directa de implementación
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Dependencia directa de fetch
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

// ✅ Bueno - abstracción mediante servicios y hooks
// services/api.ts
import axios from 'axios';
import { REST_SERVER_URL } from '../constant';

export const api = axios.create({
  baseURL: REST_SERVER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// services/userService.ts
import { api } from './api';
import { User } from '../types';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post<User>('/users', user);
    return response.data;
  },

  update: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// components/UserList.tsx
function UserList() {
  const { data: users, isLoading, error } = useUsers();
  
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

---

## 📦 Estructura de Servicios Simplificada

### Organización de archivos

```
src/
├── services/
│   ├── api.ts              # Cliente axios configurado
│   ├── userService.ts      # Servicio de usuarios
│   ├── productService.ts   # Servicio de productos
│   └── authService.ts      # Servicio de autenticación
├── hooks/
│   ├── useUsers.ts         # Hooks de usuarios
│   ├── useProducts.ts      # Hooks de productos
│   └── useAuth.ts          # Hooks de auth
├── types/
│   └── index.ts            # Tipos compartidos
└── constant.ts             # Constantes globales
```

### Ejemplo completo: Product Service

```typescript
// services/productService.ts
import { api } from './api';
import { Product, CreateProductDto, UpdateProductDto } from '../types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  update: async (id: string, product: UpdateProductDto): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/search', {
      params: { q: query },
    });
    return response.data;
  },
};
```

```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { CreateProductDto, UpdateProductDto } from '../types';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useSearchProducts(query: string) {
  return useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => productService.search(query),
    enabled: query.length > 2,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

```tsx
// components/ProductList.tsx
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

export function ProductList() {
  const { data: products, isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar producto?')) {
      deleteProduct.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={() => handleDelete(product.id)}
        />
      ))}
    </div>
  );
}
```

---

## 🗄️ Zustand - Estado Global

### Estructura básica

```tsx
// stores/userStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        
        login: (user) => set({ user, isAuthenticated: true }),
        
        logout: () => set({ user: null, isAuthenticated: false }),
        
        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ user: state.user }), // Solo persistir user
      }
    ),
    { name: 'UserStore' }
  )
);
```

### Separación por dominio

```tsx
// stores/productStore.ts
interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  fetchProducts: () => Promise<void>;
  selectProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      set({ products, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch products', error);
    }
  },
  
  selectProduct: (id) => {
    const product = get().products.find(p => p.id === id);
    set({ selectedProduct: product || null });
  },
}));

// stores/cartStore.ts
interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      
      return { items: [...state.items, { product, quantity }] };
    }),
  
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId),
    })),
  
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),
  
  clearCart: () => set({ items: [] }),
  
  total: () => {
    const items = get().items;
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
}));
```

### Selectores para performance

```tsx
// ❌ Malo - re-render innecesario
function UserProfile() {
  const state = useUserStore(); // Todo el estado
  return <div>{state.user?.name}</div>;
}

// ✅ Bueno - solo subscribe a lo necesario
function UserProfile() {
  const userName = useUserStore(state => state.user?.name);
  return <div>{userName}</div>;
}

// ✅ Selectores reutilizables
const selectUserName = (state: UserState) => state.user?.name;
const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;

function UserProfile() {
  const userName = useUserStore(selectUserName);
  const isAuth = useUserStore(selectIsAuthenticated);
  
  return <div>{isAuth && userName}</div>;
}
```

---

## 🛣️ React Router DOM - Estado Compartido

### Configuración del router

```tsx
// router/index.tsx
import { createBrowserRouter, Outlet } from 'react-router-dom';

// Layout que comparte estado
function RootLayout() {
  const { isAuthenticated } = useUserStore();
  
  return (
    <div className="app">
      <Navigation />
      <main>
        <Outlet /> {/* Componentes hijos */}
      </main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products',
        element: <ProductsLayout />,
        children: [
          { index: true, element: <ProductList /> },
          { path: ':id', element: <ProductDetail /> },
        ],
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
    ],
  },
]);
```

### Loaders para prefetch de datos

```tsx
// routes/products.tsx
import { LoaderFunctionArgs } from 'react-router-dom';
import { productService } from '../services/productService';

export async function productListLoader() {
  return await productService.getAll();
}

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) throw new Error('Product ID required');
  return await productService.getById(params.id);
}

// En el router
{
  path: 'products',
  children: [
    {
      index: true,
      element: <ProductList />,
      loader: productListLoader,
    },
    {
      path: ':id',
      element: <ProductDetail />,
      loader: productDetailLoader,
    },
  ],
}

// En el componente
function ProductDetail() {
  const product = useLoaderData() as Product;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

### Actions para mutaciones

```tsx
// routes/products.tsx
import { ActionFunctionArgs, redirect } from 'react-router-dom';
import { productService } from '../services/productService';

export async function updateProductAction({ request, params }: ActionFunctionArgs) {
  if (!params.id) throw new Error('Product ID required');
  
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  
  await productService.update(params.id, updates);
  
  return redirect(`/products/${params.id}`);
}

// En el router
{
  path: ':id',
  element: <ProductDetail />,
  loader: productDetailLoader,
  action: updateProductAction,
}

// En el componente
function ProductDetail() {
  const product = useLoaderData() as Product;
  const submit = useSubmit();
  
  const handleUpdate = (updates: Partial<Product>) => {
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    submit(formData, { method: 'put' });
  };
  
  return <ProductForm product={product} onSubmit={handleUpdate} />;
}
```

### Protected Routes

```tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Login que redirige al origen
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUserStore();
  
  const from = location.state?.from?.pathname || '/';
  
  const handleLogin = async (credentials: LoginCredentials) => {
    const user = await authService.login(credentials);
    login(user);
    navigate(from, { replace: true });
  };
  
  return <LoginForm onSubmit={handleLogin} />;
}
```

---

## ✅ Checklist React

### Componentes

- [ ] Componentes < 200 líneas
- [ ] Una responsabilidad por componente
- [ ] Props con tipos bien definidos
- [ ] Nombres descriptivos
- [ ] Sin lógica compleja en JSX

### Estado

- [ ] Estado local para UI (useState)
- [ ] Estado global solo cuando se comparte (Zustand)
- [ ] Selectores para evitar re-renders
- [ ] Estado en URL cuando es relevante (React Router)

### Servicios

- [ ] Cliente HTTP centralizado (api.ts)
- [ ] Servicios por dominio (userService, productService)
- [ ] Hooks personalizados para cada servicio
- [ ] Manejo de errores consistente
- [ ] Tipos TypeScript bien definidos

### Performance

- [ ] Memo/useMemo solo cuando es necesario
- [ ] useCallback para funciones pasadas a hijos
- [ ] Lazy loading de rutas
- [ ] Code splitting de componentes pesados
- [ ] React Query para cache
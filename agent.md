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

// ✅ Bueno - inyección de dependencia mediante hooks/context
interface UserService {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  createUser(user: CreateUserDto): Promise<User>;
}

// Implementación con fetch
class FetchUserService implements UserService {
  async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users');
    return response.json();
  }
  
  async getUserById(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
  
  async createUser(user: CreateUserDto): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.json();
  }
}

// Context para inyectar el servicio
const UserServiceContext = createContext<UserService | null>(null);

export function UserServiceProvider({ children }: { children: React.ReactNode }) {
  const service = useMemo(() => new FetchUserService(), []);
  
  return (
    <UserServiceContext.Provider value={service}>
      {children}
    </UserServiceContext.Provider>
  );
}

export function useUserService() {
  const service = useContext(UserServiceContext);
  if (!service) throw new Error('UserService not provided');
  return service;
}

// Hook que depende de la abstracción
function useUsers() {
  const service = useUserService();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    service.getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, [service]);
  
  return { users, loading };
}

// Componente que usa la abstracción
function UserList() {
  const { users, loading } = useUsers();
  
  if (loading) return <Spinner />;
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
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

### Acciones asíncronas

```tsx
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loading: false,
  error: null,
  
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch');
      const todos = await response.json();
      set({ todos, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  addTodo: async (text) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, completed: false }),
      });
      if (!response.ok) throw new Error('Failed to add');
      const newTodo = await response.json();
      set((state) => ({
        todos: [...state.todos, newTodo],
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
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

export async function productListLoader() {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  const response = await fetch(`/api/products/${params.id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
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
export async function updateProductAction({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  
  const response = await fetch(`/api/products/${params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) throw new Error('Failed to update product');
  
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

### Navegación con estado

```tsx
// Hook personalizado para navegación
function useNavigateWithState() {
  const navigate = useNavigate();
  
  return useCallback((to: string, state?: any) => {
    navigate(to, { state });
  }, [navigate]);
}

// Componente que envía estado
function ProductCard({ product }: { product: Product }) {
  const navigateWithState = useNavigateWithState();
  
  const handleClick = () => {
    navigateWithState(`/products/${product.id}`, {
      product, // Pasar el producto para evitar fetch
      from: 'list',
    });
  };
  
  return (
    <div onClick={handleClick}>
      <h3>{product.name}</h3>
    </div>
  );
}

// Componente que recibe estado
function ProductDetail() {
  const location = useLocation();
  const { id } = useParams();
  
  // Intentar usar el estado primero
  const productFromState = location.state?.product;
  const from = location.state?.from;
  
  // Si no hay estado, fetch del producto
  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    initialData: productFromState,
    enabled: !productFromState, // Solo fetch si no hay estado
  });
  
  return (
    <div>
      {from && <BackButton to={`/${from}`} />}
      <h1>{product.name}</h1>
    </div>
  );
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

### Performance

- [ ] Memo/useMemo solo cuando es necesario
- [ ] useCallback para funciones pasadas a hijos
- [ ] Lazy loading de rutas
- [ ] Code splitting de componentes pesados

### Hooks

- [ ] Custom hooks para lógica reutilizable
- [ ] Dependencias correctas en useEffect
- [ ] Cleanup en useEffect cuando es necesario

---

## 📚 Referencias

- **React Documentation** - react.dev
- **Zustand** - github.com/pmndrs/zustand
- **React Router** - reactrouter.com
- **TypeScript** - typescriptlang.org
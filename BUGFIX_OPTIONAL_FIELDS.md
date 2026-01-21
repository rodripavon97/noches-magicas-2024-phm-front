# 🐛 Fix: TypeError - Cannot read properties of undefined (reading 'map')

## 📋 Resumen del Error

**Error Original:**
```
TypeError: Cannot read properties of undefined (reading 'map')
    at Show.fromJSON (Show.ts:34:31)
    at showService.ts:45:60
```

**Causa:**
El método `Show.fromJSON` intentaba hacer `.map()` sobre campos que podían ser `undefined` cuando venían del endpoint de administrador (`/admin/shows`).

---

## 🔍 Análisis del Problema

### El Backend devuelve diferentes estructuras

**Endpoint normal** (`/shows`):
```json
{
  "id": "123",
  "nombreBanda": "AC/DC",
  "fecha": ["2024-01-20"],
  "hora": ["20:00"],
  "amigosQueVanAlShow": [
    { "id": 1, "nombre": "Juan" }
  ],
  "precioEntrada": 5000,
  "estaAbierto": true
}
```

**Endpoint admin** (`/admin/shows`):
```json
{
  "id": "123",
  "nombreBanda": "AC/DC",
  "fecha": null,           // ❌ Puede ser null
  "hora": null,            // ❌ Puede ser null
  "amigosQueVanAlShow": null,  // ❌ No viene (es admin)
  "precioEntrada": null,   // ❌ Puede ser null
  "estaAbierto": null      // ❌ Puede ser null
}
```

### El código antiguo no manejaba campos opcionales

```tsx
// ❌ ANTES - Fallaba si amigosQueVanAlShow era undefined
static fromJSON(json: ShowJSON): Show {
  return new Show(
    json.id,
    json.imagen,
    // ...
    json.amigosQueVanAlShow.map(a => UsuarioAmigos.fromJSON(a)),  // 💥 Error aquí
    // ...
  );
}
```

---

## ✅ Solución Implementada

### 1. Actualizar la interfaz ShowJSON

**Archivo:** `src/interface/interfaces.ts`

```typescript
export interface ShowJSON {
  id: string;
  imagen: string;
  nombreBanda: string;
  nombreRecital: string;
  ubicacion: string;
  fecha?: string[];                    // ✅ Opcional
  hora?: string[];                     // ✅ Opcional
  precioLocacionBarata: number;
  precioLocacionCara: number;
  amigosQueVanAlShow?: UsuarioAmigosJSON[];  // ✅ Opcional
  puntaje: number | null;
  comentariosTotales: number;
  precioEntrada?: number;              // ✅ Opcional
  estaAbierto?: boolean;               // ✅ Opcional
}
```

### 2. Actualizar Show.fromJSON con validaciones

**Archivo:** `src/domain/Show.ts`

```typescript
static fromJSON(json: ShowJSON): Show {
  return new Show(
    json.id,
    json.imagen,
    json.nombreBanda,
    json.nombreRecital,
    json.ubicacion,
    json.fecha?.map(f => new Date(f)) || [],              // ✅ Default []
    json.hora || [],                                      // ✅ Default []
    json.precioLocacionBarata,
    json.precioLocacionCara,
    json.amigosQueVanAlShow?.map(a => UsuarioAmigos.fromJSON(a)) || [],  // ✅ Default []
    json.puntaje,
    json.comentariosTotales,
    json.precioEntrada ?? 0,                              // ✅ Default 0
    json.estaAbierto ?? false                             // ✅ Default false
  );
}
```

### 3. Actualizar servicios para normalizar datos

**Archivo:** `src/service/showService.ts`

```typescript
async getShowsAdmin({ artista, location }: GetShowsAdminParams): Promise<Show[]> {
  const id = localStorage.getItem('userId')
  const showsJSON$ = await axios.get<ShowJSON[]>(
    `${REST_SERVER_URL}/admin/shows?artista=${artista || ''}&locacion=${location || ''}&id=${id || ''}`
  )
  
  // ✅ Normalizar datos antes de mapear
  return showsJSON$.data.map((showDataAdmin) => Show.fromJSON({
    ...showDataAdmin,
    fecha: showDataAdmin.fecha || [],
    hora: showDataAdmin.hora || [],
    amigosQueVanAlShow: showDataAdmin.amigosQueVanAlShow || [],
    precioEntrada: showDataAdmin.precioEntrada ?? 0,
    estaAbierto: showDataAdmin.estaAbierto ?? false,
  }))
}
```

---

## 🛡️ Patrones de Seguridad Aplicados

### 1. **Optional Chaining (`?.`)**
```typescript
// ✅ Seguro - no falla si es undefined
json.amigosQueVanAlShow?.map(a => UsuarioAmigos.fromJSON(a))

// ❌ Inseguro - falla si es undefined
json.amigosQueVanAlShow.map(a => UsuarioAmigos.fromJSON(a))
```

### 2. **Nullish Coalescing (`??`)**
```typescript
// ✅ Usa 0 si es null o undefined
json.precioEntrada ?? 0

// ⚠️ Usa 0 si es null, undefined, 0, false, ""
json.precioEntrada || 0
```

### 3. **Default Values**
```typescript
// ✅ Array vacío si es undefined
json.fecha?.map(f => new Date(f)) || []

// ❌ Podría retornar undefined
json.fecha?.map(f => new Date(f))
```

---

## 📚 Lecciones Aprendidas

### 1. **Siempre validar datos de API**

```typescript
// ❌ Asumir que los datos vienen completos
function processShow(show: ShowJSON) {
  return show.fecha.map(/* ... */);
}

// ✅ Validar y proveer defaults
function processShow(show: ShowJSON) {
  const fechas = show.fecha || [];
  return fechas.map(/* ... */);
}
```

### 2. **Usar TypeScript correctamente**

```typescript
// ❌ Campos obligatorios cuando pueden ser opcionales
interface ShowJSON {
  amigosQueVanAlShow: UsuarioAmigosJSON[];
}

// ✅ Marcar como opcionales
interface ShowJSON {
  amigosQueVanAlShow?: UsuarioAmigosJSON[];
}
```

### 3. **Normalizar datos en los servicios**

```typescript
// ✅ El servicio asegura datos consistentes
async getShows(): Promise<Show[]> {
  const data = await fetch('/api/shows');
  return data.map(show => ({
    ...show,
    fecha: show.fecha || [],
    hora: show.hora || [],
    // Garantizar estructura consistente
  }));
}
```

---

## 🧪 Testing para Prevenir

### Test para campos opcionales

```typescript
describe('Show.fromJSON', () => {
  it('should handle missing optional fields', () => {
    const incompleteShow = {
      id: '1',
      imagen: 'img.jpg',
      nombreBanda: 'Test Band',
      nombreRecital: 'Test Show',
      ubicacion: 'Buenos Aires',
      precioLocacionBarata: 1000,
      precioLocacionCara: 5000,
      puntaje: null,
      comentariosTotales: 0,
    };
    
    // ✅ No debería fallar
    const show = Show.fromJSON(incompleteShow as ShowJSON);
    
    expect(show.fecha).toEqual([]);
    expect(show.hora).toEqual([]);
    expect(show.amigosQueVanAlShow).toEqual([]);
    expect(show.precioEntrada).toBe(0);
    expect(show.estaAbierto).toBe(false);
  });
  
  it('should handle complete data', () => {
    const completeShow = {
      id: '1',
      imagen: 'img.jpg',
      nombreBanda: 'Test Band',
      nombreRecital: 'Test Show',
      ubicacion: 'Buenos Aires',
      fecha: ['2024-01-20'],
      hora: ['20:00'],
      precioLocacionBarata: 1000,
      precioLocacionCara: 5000,
      amigosQueVanAlShow: [],
      puntaje: 4.5,
      comentariosTotales: 10,
      precioEntrada: 3000,
      estaAbierto: true,
    };
    
    const show = Show.fromJSON(completeShow);
    
    expect(show.fecha).toHaveLength(1);
    expect(show.hora).toHaveLength(1);
    expect(show.precioEntrada).toBe(3000);
    expect(show.estaAbierto).toBe(true);
  });
});
```

---

## 🎯 Checklist de Validación

Al trabajar con datos de API, siempre verifica:

- [ ] ¿Los campos pueden ser `null` o `undefined`?
- [ ] ¿Usé optional chaining (`?.`) para arrays/objetos?
- [ ] ¿Proveo valores por defecto con `||` o `??`?
- [ ] ¿Marqué los campos opcionales en TypeScript?
- [ ] ¿Normalizo datos en los servicios?
- [ ] ¿Tengo tests para casos edge?

---

## 📖 Referencias

- [Optional Chaining MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [TypeScript Optional Properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties)

---

## 🔄 Antes y Después

### Antes (Frágil)
```typescript
// 💥 Falla si amigosQueVanAlShow es undefined
json.amigosQueVanAlShow.map(a => UsuarioAmigos.fromJSON(a))
```

### Después (Robusto)
```typescript
// ✅ Seguro, siempre retorna un array
json.amigosQueVanAlShow?.map(a => UsuarioAmigos.fromJSON(a)) || []
```

---

**✅ Error resuelto y código más robusto!**

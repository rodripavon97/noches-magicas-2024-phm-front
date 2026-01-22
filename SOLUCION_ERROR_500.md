# 🔧 Solución: Toast no muestra mensaje de error

## 🚨 Problema

```json
// Backend retorna esto:
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "El monto debe ser mayor a cero",
  "path": "/sumar-credito/1/-1"
}

// Pero el toast muestra:
"Ocurrió un error. Consulte al administrador del sistema"
```

## 🔍 Causa

1. **Backend**: Usa `NotFoundException` para un error de validación → retorna 500
2. **Frontend**: `useToast` oculta mensajes de errores 500+ por seguridad

## ✅ Solución Recomendada: Arreglar el Backend

### Paso 1: Crear BadRequestException

```kotlin
// Exceptions.kt
@ResponseStatus(HttpStatus.BAD_REQUEST)
class BadRequestException(msg: String) : RuntimeException(msg)
```

### Paso 2: Cambiar el código

```kotlin
// ❌ ANTES
fun aumentarSaldo(monto: Double) {
    if (monto <= 0) {
        throw NotFoundException("El monto debe ser mayor a cero")
    }
    saldo += monto
}

// ✅ DESPUÉS
fun aumentarSaldo(monto: Double) {
    if (monto <= 0) {
        throw BadRequestException("El monto debe ser mayor a cero")
    }
    saldo += monto
}
```

### Resultado

```json
// Ahora el backend retorna:
{
  "status": 400,                              ← ✅ 400 en lugar de 500
  "error": "Bad Request",
  "message": "El monto debe ser mayor a cero",
  "path": "/sumar-credito/1/-1"
}

// Y el toast muestra:
"El monto debe ser mayor a cero" ← ✅ Mensaje correcto
```

## 🔧 Solución Temporal: Modificar useToast (YA APLICADA)

He modificado `useToast` para mostrar todos los errores en **modo desarrollo**:

```typescript
// useToast.tsx
const isDevelopment = import.meta.env.DEV

const mensajeError =
  status >= 500 && !isDevelopment  // ← Ahora verás el mensaje en dev
    ? 'Ocurrió un error. Consulte al administrador del sistema'
    : message
```

### Ahora en desarrollo verás:

```
// Desarrollo (npm run dev)
Toast: "El monto debe ser mayor a cero" ✅

// Producción (npm run build)
Toast: "Ocurrió un error. Consulte al administrador" ✅
```

## 📋 Checklist de Migración Backend

Busca en tu backend y cambia:

- [ ] Validaciones de datos → `BadRequestException` (400)
- [ ] Recursos no encontrados → `NotFoundException` (404)  
- [ ] Problemas de autenticación → `UnathorizedUser` (401)
- [ ] Problemas de permisos → `UnauthorizedEditData` (401)

### Ejemplos

```kotlin
// ✅ BadRequestException (400)
if (monto <= 0) throw BadRequestException("El monto debe ser mayor a cero")
if (nombre.isBlank()) throw BadRequestException("El nombre es requerido")
if (email.contains("@").not()) throw BadRequestException("Email inválido")

// ✅ NotFoundException (404)
val show = showRepo.findById(id) ?: throw NotFoundException("Show no encontrado")
val user = userRepo.findById(id) ?: throw NotFoundException("Usuario no encontrado")

// ✅ UnathorizedUser (401)
if (!validPassword) throw UnathorizedUser("Credenciales inválidas")

// ✅ UnauthorizedEditData (401)
if (!user.esAdmin) throw UnauthorizedEditData("Sin permisos de administrador")
```

## 🎯 Resumen

| Solución | Dónde | Estado |
|----------|-------|--------|
| **Opción 1** (Recomendada) | Backend | ⏳ Por hacer |
| **Opción 2** (Temporal) | Frontend | ✅ YA HECHA |

**Recomendación**: Implementa la Opción 1 en el backend para tener el comportamiento correcto en producción.

## 📝 Documentación Relacionada

- `BACKEND_EXCEPTIONS.md` - Guía completa de excepciones
- `MANEJO_ERRORES.md` - Flujo de errores frontend
- `src/service/README.md` - Reglas de servicios

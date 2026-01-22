# 🔧 Configuración de Excepciones en el Backend

## Problema Actual

El backend lanza `NotFoundException` (404) para errores de validación, causando que:
1. El error real sea 500 Internal Server Error
2. El frontend muestre un mensaje genérico en lugar del mensaje específico

## ✅ Solución: Crear BadRequestException

### 1. Agregar nueva excepción en Kotlin

```kotlin
// Exceptions.kt
package ar.edu.unsam.phm.tpphmgrupo4.Exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

// ✅ NUEVA: Para errores de validación
@ResponseStatus(HttpStatus.BAD_REQUEST)
class BadRequestException(msg: String) : RuntimeException(msg)

// Existentes
class IdInvalido(mensaje: String) : RuntimeException(mensaje)
class NoExisteElemento(mensaje: String) : RuntimeException(mensaje)
class NoExisteProceso(mensaje: String) : RuntimeException(mensaje)
class ListaDeProcesosVacia(mensaje: String) : RuntimeException(mensaje)

@ResponseStatus(HttpStatus.NOT_FOUND)
class NotFoundException(msg: String) : RuntimeException(msg)

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class UnathorizedUser(msg: String) : RuntimeException(msg)

@ResponseStatus(HttpStatus.UNAUTHORIZED)
class UnauthorizedEditData(msg: String) : RuntimeException(msg)
```

### 2. Usar BadRequestException para validaciones

```kotlin
// ❌ ANTES
fun aumentarSaldo(monto: Double) {
    if (monto <= 0) {
        throw NotFoundException("El monto debe ser mayor a cero") // 404 ❌
    }
    saldo += monto
}

// ✅ DESPUÉS
fun aumentarSaldo(monto: Double) {
    if (monto <= 0) {
        throw BadRequestException("El monto debe ser mayor a cero") // 400 ✅
    }
    saldo += monto
}
```

## 📋 Cuándo usar cada excepción

| Excepción | Código HTTP | Cuándo usar |
|-----------|-------------|-------------|
| `BadRequestException` | 400 | Validaciones, datos inválidos |
| `NotFoundException` | 404 | Recurso no encontrado |
| `UnathorizedUser` | 401 | Usuario no autenticado |
| `UnauthorizedEditData` | 401 | Usuario sin permisos |

### Ejemplos

```kotlin
// ✅ BadRequestException (400) - Validaciones
fun agregarCredito(monto: Double) {
    if (monto <= 0) {
        throw BadRequestException("El monto debe ser mayor a cero")
    }
    if (monto > 10000) {
        throw BadRequestException("El monto máximo es 10000")
    }
    saldo += monto
}

fun editarDatos(nombre: String, apellido: String) {
    if (nombre.isBlank()) {
        throw BadRequestException("El nombre no puede estar vacío")
    }
    if (apellido.isBlank()) {
        throw BadRequestException("El apellido no puede estar vacío")
    }
    // ...
}

// ✅ NotFoundException (404) - Recursos no encontrados
fun getShowById(id: String): Show {
    return showRepository.findById(id) 
        ?: throw NotFoundException("Show no encontrado con id: $id")
}

fun getUserById(id: Int): User {
    return userRepository.findById(id)
        ?: throw NotFoundException("Usuario no encontrado")
}

// ✅ UnathorizedUser (401) - Autenticación
fun login(username: String, password: String) {
    val user = userRepository.findByUsername(username)
        ?: throw UnathorizedUser("Credenciales inválidas")
    
    if (!passwordEncoder.matches(password, user.password)) {
        throw UnathorizedUser("Credenciales inválidas")
    }
    
    return user
}

// ✅ UnauthorizedEditData (401) - Permisos
fun deleteShow(showId: String, userId: Int) {
    val user = getUserById(userId)
    
    if (!user.esAdmin) {
        throw UnauthorizedEditData("Solo administradores pueden eliminar shows")
    }
    
    showRepository.delete(showId)
}
```

## 🔄 Flujo Correcto

### Con BadRequestException (400)

```
Frontend envía: monto = -1
    ↓
Backend valida y lanza: BadRequestException("El monto debe ser mayor a cero")
    ↓
Spring retorna: HTTP 400
{
  "timestamp": "2026-01-22T22:18:25.832Z",
  "status": 400,                              ← 400 ✅
  "error": "Bad Request",
  "message": "El monto debe ser mayor a cero", ← Mensaje claro ✅
  "path": "/sumar-credito/1/-1"
}
    ↓
Frontend (useToast): status = 400 (< 500)
    ↓
Toast muestra: "El monto debe ser mayor a cero" ✅
```

### Con NotFoundException actual (500)

```
Frontend envía: monto = -1
    ↓
Backend lanza: NotFoundException (esperaba 404 pero...)
    ↓
Spring retorna: HTTP 500 (error interno)
{
  "status": 500,                              ← 500 ❌
  "error": "Internal Server Error",
  "message": "El monto debe ser mayor a cero",
  "trace": "java.lang.IllegalArgumentException..."
}
    ↓
Frontend (useToast): status = 500 (>= 500)
    ↓
Toast muestra: "Ocurrió un error. Consulte al administrador" ❌
```

## 🎯 Migración Rápida

Busca en tu backend estos patrones y cámbialos:

```kotlin
// ❌ Cambiar esto
throw NotFoundException("El X debe ser Y")
throw NotFoundException("X es inválido")
throw NotFoundException("X no puede estar vacío")

// ✅ Por esto
throw BadRequestException("El X debe ser Y")
throw BadRequestException("X es inválido")
throw BadRequestException("X no puede estar vacío")
```

Mantén `NotFoundException` solo para:

```kotlin
// ✅ Uso correcto de NotFoundException
val show = showRepository.findById(id)
    ?: throw NotFoundException("Show no encontrado")

val user = userRepository.findById(id)
    ?: throw NotFoundException("Usuario no encontrado")
```

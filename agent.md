# Frontend Architecture Agent – React 19 + TypeScript

Sos un **Arquitecto Frontend** responsable de refactorizar y generar código profesional, escalable y tipado.

Este proyecto debe cumplir **estrictamente** los siguientes principios y reglas.

---

## 1️⃣ Stack obligatorio

Usar únicamente:

- React 19
- TypeScript
- Axios
- Zustand
- Custom Hooks
- Arquitectura basada en capas

❌ PROHIBIDO:
- JSX (solo TSX)
- PropTypes
- useState para estado global
- console.log / console.error
- Lógica de negocio en componentes

---

## 2️⃣ Arquitectura obligatoria

La app debe estructurarse así:

src/
├── api/ # Axios + JWT + requests
├── domain/ # Entidades y contratos
├── services/ # Casos de uso
├── stores/ # Zustand
├── hooks/ # Hooks de UI
├── components/ # Componentes puros
├── pages/ # Screens
├── validations/ # Validaciones de formularios
├── errors/ # Error handler
└── types/


---

## 3️⃣ Axios + JWT (OBLIGATORIO)

Toda llamada HTTP debe pasar por:

```ts
httpRequest<T>()
Nunca usar axios directo en componentes o stores.

Todos los requests deben:

Enviar JWT

Usar XSRF

Estar tipados

4️⃣ Manejo de errores (OBLIGATORIO)
Todos los errores deben pasar por:

getErrorMessage(error)
Los componentes:

Nunca muestran error directamente

Nunca hacen console.error

Siempre usan getErrorMessage

Ejemplo obligatorio:

try {
  await peliculaService.eliminar(pelicula.id)
  toast.success('Película eliminada')
} catch (e) {
  toast.error(getErrorMessage(e))
}
5️⃣ SOLID + Clean Code
Todo el código debe cumplir:

Single Responsibility
Componentes: solo UI

Hooks: solo orquestación

Stores: solo estado

Services: solo lógica de negocio

API: solo HTTP

Dependency Inversion
Los componentes nunca conocen Axios ni endpoints.

Solo conocen:

peliculaService.eliminar(id)
6️⃣ Zustand obligatorio
No se permite:

useState para datos remotos

Props drilling

Todo estado global va en:

/stores
Ejemplo esperado:

usePeliculasStore.ts
  - peliculas
  - loading
  - error
  - loadPeliculas()
  - eliminarPelicula(id)
7️⃣ Custom Hooks
Los componentes solo usan hooks:

const { peliculas, eliminar, loading } = usePeliculas()
El hook conecta:

Store

Validaciones

Services

Errors

8️⃣ Formularios y validaciones
Toda pantalla con inputs debe usar:

/validations
Las validaciones:

Son funciones puras

Retornan mensajes de error tipados

Ejemplo:

validatePeliculaForm(form): ValidationResult
9️⃣ Tipado obligatorio
Todo debe estar tipado:

Props

Responses

Requests

Stores

Forms

Hooks

No usar any.

🔟 Migración JSX → TSX
Todo archivo .jsx debe convertirse a .tsx.

Debe:

Tener interfaces de props

Tipar eventos

Eliminar PropTypes

11️⃣ Patrón de UI correcto
Los componentes deben:

No llamar APIs

No tener lógica

No transformar datos

Solo renderizan lo que el hook les entrega.

Ejemplo:

export const PeliculasPage = () => {
  const { peliculas, eliminar, loading } = usePeliculas()

  if (loading) return <Spinner />

  return <PeliculasList peliculas={peliculas} onDelete={eliminar} />
}
12️⃣ Criterio de calidad
Si el código:

No está desacoplado

No es testeable

No está tipado

No respeta capas

Debe ser refactorizado.

No se aceptan shortcuts.

13️⃣ Objetivo final
El código debe quedar:

Escalable

Tipado

Profesional

Listo para producción

Compatible con JWT, refresh y seguridad
// ============================================
// VALIDACIONES DE FORMULARIOS
// ============================================

import { ValidationResult } from '../types'

/**
 * Validaciones comunes reutilizables
 */
export const validators = {
  required: (value: any): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo es obligatorio'
    }
    return null
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Email inválido'
    }
    return null
  },

  minLength: (min: number) => (value: string): string | null => {
    if (value.length < min) {
      return `Debe tener al menos ${min} caracteres`
    }
    return null
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (value.length > max) {
      return `Debe tener máximo ${max} caracteres`
    }
    return null
  },

  min: (min: number) => (value: number): string | null => {
    if (value < min) {
      return `El valor mínimo es ${min}`
    }
    return null
  },

  max: (max: number) => (value: number): string | null => {
    if (value > max) {
      return `El valor máximo es ${max}`
    }
    return null
  },

  positiveNumber: (value: number): string | null => {
    if (value <= 0) {
      return 'Debe ser un número positivo'
    }
    return null
  },

  date: (value: string): string | null => {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }
    return null
  },
}

/**
 * Helper para ejecutar múltiples validaciones en un campo
 */
function validateField(
  value: any,
  fieldValidators: Array<(value: any) => string | null>
): string | null {
  for (const validator of fieldValidators) {
    const error = validator(value)
    if (error) return error
  }
  return null
}

/**
 * Helper para crear un ValidationResult
 */
function createValidationResult(errors: Record<string, string>): ValidationResult {
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// ============================================
// VALIDACIONES ESPECÍFICAS DE FORMULARIOS
// ============================================

/**
 * Datos del formulario de login
 */
export interface LoginForm {
  username: string
  password: string
}

/**
 * Valida el formulario de login
 */
export function validateLoginForm(form: LoginForm): ValidationResult {
  const errors: Record<string, string> = {}

  const usernameError = validateField(form.username, [
    validators.required,
    validators.minLength(3),
  ])
  if (usernameError) errors.username = usernameError

  const passwordError = validateField(form.password, [
    validators.required,
    validators.minLength(6),
  ])
  if (passwordError) errors.password = passwordError

  return createValidationResult(errors)
}

/**
 * Datos del formulario de edición de usuario
 */
export interface EditUserForm {
  nombre: string
  apellido: string
}

/**
 * Valida el formulario de edición de usuario
 */
export function validateEditUserForm(form: EditUserForm): ValidationResult {
  const errors: Record<string, string> = {}

  const nombreError = validateField(form.nombre, [
    validators.required,
    validators.minLength(2),
    validators.maxLength(50),
  ])
  if (nombreError) errors.nombre = nombreError

  const apellidoError = validateField(form.apellido, [
    validators.required,
    validators.minLength(2),
    validators.maxLength(50),
  ])
  if (apellidoError) errors.apellido = apellidoError

  return createValidationResult(errors)
}

/**
 * Datos del formulario de comentario
 */
export interface ComentarioForm {
  contenido: string
  puntuacion: number | null
}

/**
 * Valida el formulario de comentario
 */
export function validateComentarioForm(form: ComentarioForm): ValidationResult {
  const errors: Record<string, string> = {}

  const contenidoError = validateField(form.contenido, [
    validators.required,
    validators.minLength(10),
    validators.maxLength(500),
  ])
  if (contenidoError) errors.contenido = contenidoError

  if (form.puntuacion !== null) {
    const puntuacionError = validateField(form.puntuacion, [
      validators.min(1),
      validators.max(5),
    ])
    if (puntuacionError) errors.puntuacion = puntuacionError
  }

  return createValidationResult(errors)
}

/**
 * Datos del formulario de agregar al carrito
 */
export interface AgregarCarritoForm {
  cantidad: number
  idFuncion: number
}

/**
 * Valida el formulario de agregar al carrito
 */
export function validateAgregarCarritoForm(form: AgregarCarritoForm): ValidationResult {
  const errors: Record<string, string> = {}

  const cantidadError = validateField(form.cantidad, [
    validators.required,
    validators.positiveNumber,
    validators.max(10),
  ])
  if (cantidadError) errors.cantidad = cantidadError

  const funcionError = validateField(form.idFuncion, [validators.required])
  if (funcionError) errors.idFuncion = funcionError

  return createValidationResult(errors)
}

/**
 * Datos del formulario de nueva función
 */
export interface NuevaFuncionForm {
  fecha: string
  hora: string
}

/**
 * Valida el formulario de nueva función
 */
export function validateNuevaFuncionForm(form: NuevaFuncionForm): ValidationResult {
  const errors: Record<string, string> = {}

  const fechaError = validateField(form.fecha, [validators.required, validators.date])
  if (fechaError) errors.fecha = fechaError

  const horaError = validateField(form.hora, [validators.required])
  if (horaError) errors.hora = horaError

  // Validar que la fecha no sea pasada
  if (!fechaError) {
    const fecha = new Date(form.fecha)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    if (fecha < hoy) {
      errors.fecha = 'La fecha no puede ser en el pasado'
    }
  }

  return createValidationResult(errors)
}

/**
 * Datos del formulario de edición de show
 */
export interface EditShowForm {
  nombreBanda: string
  nombreShow: string
}

/**
 * Valida el formulario de edición de show
 */
export function validateEditShowForm(form: EditShowForm): ValidationResult {
  const errors: Record<string, string> = {}

  const bandaError = validateField(form.nombreBanda, [
    validators.required,
    validators.minLength(2),
    validators.maxLength(100),
  ])
  if (bandaError) errors.nombreBanda = bandaError

  const showError = validateField(form.nombreShow, [
    validators.required,
    validators.minLength(2),
    validators.maxLength(100),
  ])
  if (showError) errors.nombreShow = showError

  return createValidationResult(errors)
}

/**
 * Datos del formulario de sumar crédito
 */
export interface SumarCreditoForm {
  credito: number
}

/**
 * Valida el formulario de sumar crédito
 */
export function validateSumarCreditoForm(form: SumarCreditoForm): ValidationResult {
  const errors: Record<string, string> = {}

  const creditoError = validateField(form.credito, [
    validators.required,
    validators.positiveNumber,
    validators.max(100000),
  ])
  if (creditoError) errors.credito = creditoError

  return createValidationResult(errors)
}

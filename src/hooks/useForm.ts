import { useState, ChangeEvent, FormEvent } from 'react'

interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

interface UseFormOptions<T> {
  initialValues: T
  validationRules?: ValidationRules<T>
  onSubmit: (values: T) => Promise<void>
}

interface UseFormResult<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  handleBlur: (field: keyof T) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
  resetForm: () => void
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  setFieldError: <K extends keyof T>(field: K, error: string) => void
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = <K extends keyof T>(field: K, value: T[K]): string | undefined => {
    const rules = validationRules[field]
    if (!rules) return undefined

    for (const rule of rules) {
      if (!rule.validate(value)) {
        return rule.message
      }
    }
    return undefined
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    const field = name as keyof T
    
    // Handle checkboxes
    const fieldValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : value

    setValues(prev => ({ ...prev, [field]: fieldValue }))

    if (touched[field]) {
      const error = validateField(field, fieldValue as T[keyof T])
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: keyof T): void => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, values[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    // Validar todos los campos
    const newErrors: Partial<Record<keyof T, string>> = {}
    let hasErrors = false

    (Object.keys(values) as Array<keyof T>).forEach(field => {
      const error = validateField(field, values[field])
      if (error) {
        newErrors[field] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    )

    if (hasErrors) return

    setIsSubmitting(true)
    // SIN try-catch - el componente maneja el error
    await onSubmit(values)
    setIsSubmitting(false)
  }

  const resetForm = (): void => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]): void => {
    setValues(prev => ({ ...prev, [field]: value }))
  }

  const setFieldError = <K extends keyof T>(field: K, error: string): void => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  }
}

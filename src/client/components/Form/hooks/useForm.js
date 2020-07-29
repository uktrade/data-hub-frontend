import { useEffect, useState } from 'react'
import { isEmpty, isEqual } from 'lodash'
import { useDeepCompareEffect } from 'react-use'

// Based on react-use/useBeforeUnload but can handle custom handlers (for tests).
function useBeforeUnload(enabled, onExit) {
  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      const callbackReturnValue =
        typeof onExit === 'function' ? onExit() : false
      if (callbackReturnValue) {
        // eslint-disable-next-line no-param-reassign
        event.returnValue = callbackReturnValue
      }
      return callbackReturnValue
    }

    if (enabled) {
      window.addEventListener('beforeunload', handler)
    }

    return () => window.removeEventListener('beforeunload', handler)
  }, [enabled, onExit])
}

function useForm({
  initialValues = {},
  initialStep = 0,
  onSubmit,
  scrollToTop = true,
  onExit,
} = {}) {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [fields, setFields] = useState({})
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState(null)
  const isDirty =
    !isEmpty(touched) || (!isEmpty(values) && !isEqual(values, initialValues))

  const [redirectUrl, setRedirectUrl] = useState(null)

  const formState = {
    values,
    touched,
    errors,
    fields,
    steps,
    currentStep,
    isLoading,
    isSubmitted,
    isDirty,
    submissionError,
  }

  useBeforeUnload(
    isDirty && !isSubmitted && !submissionError && !redirectUrl,
    onExit
  )

  useEffect(() => {
    if (redirectUrl) {
      window.location.assign(redirectUrl)
    }
  }, [redirectUrl])

  useDeepCompareEffect(() => {
    if (scrollToTop) {
      window.scrollTo(0, 0)
    }
  }, [currentStep, errors])

  const getFieldState = (name, initialState) => {
    return {
      value: values[name] ?? initialState,
      touched: touched[name] || false,
      error: errors[name] || null,
    }
  }

  const validateField = (name) => {
    const field = fields[name]
    const value = values[name]

    if (!field) {
      throw new Error(`Field ${name} does not exist`)
    }

    if (field && 'validate' in field) {
      if (typeof field.validate === 'function') {
        return field.validate(value, name, formState)
      }

      if (Array.isArray(field.validate)) {
        const validationErrors = field.validate
          .map((validator) => validator(value, field, formState))
          .filter((e) => e)
        return validationErrors.length > 0 ? validationErrors[0] : null
      }
    }

    return null
  }

  const validateForm = (fieldNames = []) => {
    const fieldsToValidate =
      fieldNames.length > 0 ? fieldNames : Object.keys(fields)
    const newErrors = {}
    const newTouched = {}

    fieldsToValidate.forEach((name) => {
      const error = validateField(name)
      if (error) {
        newErrors[name] = error
      }
      newTouched[name] = true
    })

    setErrors(newErrors)
    setTouched(newTouched)

    return newErrors
  }

  const setFieldValue = (name, fieldValue) =>
    setValues((prevValues) => {
      return { ...prevValues, [name]: fieldValue }
    })
  const setFieldTouched = (name, fieldTouched) => {
    setTouched((prevTouched) => ({ ...prevTouched, [name]: fieldTouched }))
  }
  const setFieldError = (name, error) =>
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }))

  const registerField = (field) =>
    setFields((prevFields) => {
      const { name, initialValue } = field

      if (initialValue && values[name] === undefined) {
        setFieldValue(name, initialValue)
      }

      setFieldTouched(name, false)

      if (!(name in prevFields)) {
        return {
          ...prevFields,
          [name]: field,
        }
      }
      return prevFields
    })

  const deregisterField = (name) => {
    setFields((prevFields) => {
      const newFields = { ...prevFields }
      delete newFields[name]
      return newFields
    })
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      delete newErrors[name]
      return newErrors
    })
    setTouched((prevTouched) => {
      const newTouched = { ...prevTouched }
      delete newTouched[name]
      return newTouched
    })
  }

  const registerStep = (name) => {
    setSteps((prevSteps) => {
      if (!prevSteps.includes(name)) {
        const newSteps = [...prevSteps]
        newSteps.push(name)
        return newSteps
      }
      return prevSteps
    })
  }
  const deregisterStep = (name) =>
    setSteps((prevSteps) => prevSteps.filter((s) => s !== name))

  const isFirstStep = () => currentStep === 0
  const isLastStep = () =>
    currentStep === steps.length - 1 || steps.length === 0

  const submitForm = async () => {
    try {
      let newRedirectUrl
      setIsLoading(true)

      if (typeof onSubmit === 'function') {
        newRedirectUrl = await onSubmit(values)
      }

      if (newRedirectUrl) {
        setRedirectUrl(newRedirectUrl)
      } else {
        setIsLoading(false)
        setIsSubmitted(true)
      }
    } catch (e) {
      setSubmissionError(e)
      setIsLoading(false)
    }
  }

  const getStepIndex = (stepName) => {
    const index = steps.indexOf(stepName)
    return index !== -1 ? index : null
  }

  const goForward = async () => {
    const validationErrors = validateForm()

    if (!isEmpty(validationErrors)) {
      return
    }

    if (!isLastStep()) {
      setCurrentStep(currentStep + 1)
      return
    }

    await submitForm()
  }

  const goBack = () => setCurrentStep(currentStep - 1)

  const goToStepByName = (stepName) => setCurrentStep(steps.indexOf(stepName))

  return {
    ...formState,
    registerField,
    deregisterField,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    getFieldState,
    validateForm,
    validateField,
    registerStep,
    deregisterStep,
    setCurrentStep,
    setIsLoading,
    setIsSubmitted,
    goForward,
    goBack,
    goToStepByName,
    getStepIndex,
    isLastStep,
    isFirstStep,
  }
}

export default useForm

import { CSV_FORMULA_INJECTION_REGEX } from '../client/constants'

const nameValidator = (value) => {
  if (!value) {
    return 'Enter name'
  } else if (CSV_FORMULA_INJECTION_REGEX.test(value)) {
    return 'Enter a valid name'
  }
  return null
}

export default nameValidator

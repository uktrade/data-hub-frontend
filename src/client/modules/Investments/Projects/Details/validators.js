export const POSITIVE_INT_REGEX = /^[0-9]{1,19}$/
export const isPositiveInteger = (value) => POSITIVE_INT_REGEX.test(value)

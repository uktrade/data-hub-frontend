/**
 * Marks function as deprecated so, that it prints a warning to the
 * console with a replacement suggestion.
 * @param {string} name - The name of the deprecated function
 * @param {string} alternative - The suggested alternative
 * @param {Function} deprecatedFunction - The deprecated function
 * @returns {Function} - Returns a function identical to {deprecatedFunction}
 * which logs a warning to the console when called.
 */
export default (name, alternative, f) => {
  const marked = (...args) => {
    // eslint-disable-next-line no-console
    console.warn(`Function ${name} is deprecated, use ${alternative} instead`)
    return f(...args)
  }

  if (f.propTypes) {
    marked.propTypes = f.propTypes
  }

  return marked
}

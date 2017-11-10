/**
 *
 * @param {string} currentValue - The current value for a field so that the options filtered include the current
 *                                even if invalid
 * @returns {function} - a filter function that will filter out inactive or non-current values
 */
function filterDisabledOption (currentValue) {
  return function (item) {
    return !item.disabled_on || item.id === currentValue
  }
}

module.exports = {
  filterDisabledOption,
}

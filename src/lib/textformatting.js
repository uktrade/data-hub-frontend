/**
 * Translate text to sentence case, e.g. the cat sat -> The cat sat
 *
 * @param {string} str text
 * @returns {string} result formatted text
 */
function titleCase (str) {
  if (typeof str !== 'string' || str.length === 0) {
    return null
  }

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}


/**
 * turn text with \n into <br/>
 *
 * @param {string} str
 * @returns {string} formatted text
 */
function newlineToBr (str) {
  if (typeof str !== 'string' || str.length === 0) {
    return null
  }

  return str.replace(/(?:\r\n|\r|\n)/g, '<br/>')
}

module.exports = {titleCase, newlineToBr}

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

module.exports = {
  newlineToBr,
}

/**
 * Translate text to sentance case, e.g. the cat sat -> The cat sat
 *
 * @param {string} source text
 * @returns {string} result formatted text
 */
function sentenceCase (str) {
  if ((str === null) || (str === '')) {
    return false
  } else {
    str = str.toString()
  }

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}


/**
 * turn text with \n into <br/>
 *
 * @param {string} text
 * @returns {string} formatted text
 */
function newlineToBr (text) {
  return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
}

module.exports = {sentenceCase, newlineToBr}

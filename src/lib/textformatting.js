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

function getPropertyName (object, key) {
  if (object && typeof object === 'object' && object.hasOwnProperty(key) && object[key] !== null) {
    return object[key].name
  }
  return null
}

function getContactName (contact) {
  let name = ''
  if (contact.first_name) {
    name += `${contact.first_name} `
  }
  if (contact.last_name) {
    name += contact.last_name
  }
  return name.trim()
}

function getContactLink (object) {
  if (object.contact) {
    return `<a href="/contact/${object.contact.id}/details">${getContactName(object.contact)}</a>`
  }
  return null
}

module.exports = {titleCase, newlineToBr, getPropertyName, getContactName, getContactLink}

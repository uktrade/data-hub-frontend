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

module.exports = {
  newlineToBr,
  getContactName,
  getContactLink,
}

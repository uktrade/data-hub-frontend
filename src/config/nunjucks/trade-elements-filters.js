/* global JSON:true */

/**
 * object used store the methods registered as a 'filter' (of the same name) within nunjucks
 * filter.foo("input") here, becomes {{ "input" | foo }} within nunjucks templates
 * @type {Object}
 */
const filter = {}

/**
 * logs an object in the template to the console on the client.
 * @param  {*} a any type
 * @return {String}   a script tag with a console.log call.
 * @example {{ "hello world" | log }}
 * @example {{ "hello world" | log | safe }}  [for environments with autoescaping turned on]
 */
filter.log = function log(a) {
  return '<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>'
}

function escapeRegExp(str) {
  if (str || str.length === 0) return str
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

filter.highlightTerm = function highlightTerm(phrase, term = '') {
  try {
    if (!phrase) phrase = ''
    if (phrase.length === 0 || term.length === 0) return phrase

    const cleanTerm = term.replace(/\*/g, '').replace(/\\/g, '\\\\')
    const regex = new RegExp(escapeRegExp(`(${cleanTerm})`), 'gi')
    return phrase.replace(regex, '<strong>$1</strong>')
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return phrase
  }
}

/**
 * returns a standard gov.uk date from an epoch using date-fns
 * date-fns documentation: https://date-fns.org
 * @method function
 * @param  {string} date date e.g 1462834800000
 * @param  {string} format date-fns format string (to override the default if needed)
 * @return {string} date string as per the current gov.uk standard 09/12/1981 -> 09 December 1981
 */
filter.date = function (date, format) {
  format = format || 'dd MMMM YYYY, h:mm:ss aaa'

  const formatted = format(date, format)

  if (formatted === 'Invalid date') {
    return ''
  }

  return formatted
}

filter.pluralise = function (number, string) {
  if (number !== 1) {
    string += 's'
  }

  return number + ' ' + string
}

filter.isArray = function (value) {
  return Array.isArray(value)
}

filter.keys = function (value) {
  return Object.keys(value)
}

module.exports = filter

const getSectionElementSelector = require('./helpers/getSectionElementSelector')

/**
 * Get a random option from a select not including the first option element as this is generally a placeholder
 * @param selector
 * @param callback
 */
exports.command = function getListOption (selector, callback) {
  const normalisedSelector = getSectionElementSelector(selector)

  return this.elements('css selector', `${normalisedSelector} option`, (result) => {
    if (result.value.length) {
      const random = Math.floor((Math.random() * (result.value.length - 1)) + 1) // we don't want the first option in a select

      this.elementIdAttribute(result.value[random].ELEMENT, 'text', function (results) {
        if (typeof callback === 'function') {
          callback.call(this, results.value.trim())
        }
      })
    } else {
      this.log(`check the contents of the selector: ${normalisedSelector}`)
    }
  })
}

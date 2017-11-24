/**
 * If you pass a PageObject.section.element via '@' notation to a custom command nightwatch passes the section and
 * element in an array, rather than the element selector.
 * This method extracts the selector of the PageObject.section.element so it can be used in custom commands.
 * Normalising the use of '@' with custom commands, so PageObject.element and PageObject.section.element work in the
 * same way snd provide a selector string.
 *
 * @param {{Section}{Element}[]} value
 * @returns {string} element selector
 */
// FIXME is this still an issue https://github.com/nightwatchjs/nightwatch/issues/1635
function getSectionElementSelector (value) {
  if (Array.isArray(value)) {
    return value[1].selector
  }
  return value
}

module.exports = getSectionElementSelector

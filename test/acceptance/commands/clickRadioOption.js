/**
 * Utility to click a specific option by textContent in a named radio element
 * @param name
 * @param textContent
 * @returns this
 */
exports.command = function clickRadioOption (name, textContent) {
  return this.click('xpath', `//form//label[normalize-space(.)="${textContent}"]`)
}

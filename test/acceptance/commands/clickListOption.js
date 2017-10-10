/**
 * Utility to click a specific option by textContent in a named select element
 * @param name
 * @param textContent
 * @returns this
 */
exports.command = function clickListOption (name, textContent) {
  return this.click('xpath', `//select[@name="${name}"]/option[normalize-space(.)="${textContent}"]`)
}

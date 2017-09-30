/**
 * Replaces existing field value with one provided
 * @param selector
 * @param value
 * @returns this
 */
exports.command = function replaceValue (selector, value) {
  return this
    .clearValue(selector)
    .setValue(selector, value)
}

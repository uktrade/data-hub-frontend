/**
 * Utility to select a particular value from a list of radio or checkbox
 * input elements. It matches based on the text content of the associated
 * label element
 *
 * @param name - name used for the list of input elements
 * @param labelContent - content of the label element associated with the input
 *
 * @returns this
 */
exports.command = function clickMultipleChoiceOption(name, labelContent) {
  return this.click(
    'xpath',
    `//input[@name="${name}"]/following-sibling::label[normalize-space(.)="${labelContent}"]`
  )
}

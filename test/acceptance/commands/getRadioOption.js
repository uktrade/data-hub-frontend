/**
 * Get a random option from a radio button list
 * @param selector
 * @param callback
 */
exports.command = function getRadioOption (name, callback) {
  return this.elements('css selector', `input[name="${name}"] + label span`, (result) => {
    const random = Math.floor(Math.random() * (result.value.length - 1))

    this.elementIdAttribute(result.value[random].ELEMENT, 'textContent', function (textContent) {
      if (typeof callback === 'function') {
        const id = `field-${name}-${random + 1}`
        callback.call(this, { labelSelector: `label[for=${id}]`, text: textContent.value.trim() })
      }
    })
  })
}

/**
 * Get a random or defined option from a radio button list
 * @param props.name - Fieldname
 * @param prop.option - The text for the option to pick
 * @param callback
 */
exports.command = function getRadioOption({ name, option }, callback) {
  const selector = `input[name="${name}"] + label span`

  return this.elements('css selector', selector, (result) => {
    if (result.value.length) {
      if (!option) {
        const random = Math.floor(Math.random() * result.value.length)

        this.elementIdAttribute(
          result.value[random].ELEMENT,
          'textContent',
          function({ value: textContent }) {
            if (typeof callback === 'function') {
              const id = `field-${name}-${random + 1}`
              callback.call(this, {
                labelSelector: `label[for=${id}]`,
                text: textContent.trim(),
              })
            }
          }
        )

        return
      }

      for (let pos = 0; pos < result.value.length; pos += 1) {
        this.elementIdAttribute(
          result.value[pos].ELEMENT,
          'textContent',
          function({ value: textContent }) {
            if (textContent === option && typeof callback === 'function') {
              const id = `field-${name}-${pos + 1}`
              callback.call(this, {
                labelSelector: `label[for=${id}]`,
                text: textContent.trim(),
              })
            }
          }
        )
      }
    } else {
      this.log(`check the contents of the selector: ${selector}`)
    }
  })
}

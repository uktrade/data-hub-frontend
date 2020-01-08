/*
 * Mirror Value
 *
 * Listens for a change on one form element and mirrors the value to another
 */
const MirrorValue = {
  init(wrapper = document) {
    const sourceField = wrapper.querySelector('.js-MirrorValue')

    if (sourceField) {
      const targetSelector = sourceField.getAttribute('data-target-selector')
      const targetField = wrapper.querySelector(targetSelector)

      sourceField.addEventListener('change', (event) => {
        targetField.value = event.target.value
      })
    }
  },
}

module.exports = MirrorValue

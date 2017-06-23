const { addClass, removeClass } = require('../_deprecated/lib/element-stuff.js')

function getControlLabel (control) {
  if (control.type !== 'checkbox') { return }

  const labelEl = control.parentElement

  if (labelEl.className.indexOf('selection-button-checkbox') < 0) { return }

  return labelEl
}

const LabelSelect = {
  init () {
    this.bindEvents()
  },

  bindEvents () {
    document.addEventListener('change', this.onChangeHandler)
    document.addEventListener('focus', this.onFocusHandler, true)
  },

  onChangeHandler (evt) {
    const target = evt.target || evt.srcElement
    const labelEl = getControlLabel(target)
    const selectedClassName = 'selected'

    if (!labelEl) { return }

    if (target.checked) {
      addClass(labelEl, selectedClassName)
    } else {
      removeClass(labelEl, selectedClassName)
    }
  },

  onFocusHandler (evt) {
    const target = evt.target || evt.srcElement
    const focusedEl = getControlLabel(target)
    const focusedClassName = 'focused'

    if (!focusedEl) { return }

    addClass(focusedEl, focusedClassName)

    target.addEventListener('blur', () => removeClass(focusedEl, focusedClassName))
  },
}

module.exports = LabelSelect

const CONSTANTS = {
  selectors: {
    button: 'js-prevent-multiple-submits',
    form: 'form',
  },
  types: {
    submit: 'submit',
  },
  attributes: {
    disabled: 'disabled',
  },
  events: {
    click: 'click',
  },
}

const PreventMultipleSubmits = {
  isSubmitting: false,
  counter: 0,

  init () {
    if (document.querySelectorAll(`.${CONSTANTS.selectors.button}`).length) {
      this.bindEvents()
    }
  },

  handleFormSubmit (event) {
    const target = event.target
    const targetForm = target.closest(CONSTANTS.selectors.form)
    if (!targetForm ||
      !target.classList.contains(CONSTANTS.selectors.button)) { return }

    if (this.counter >= 1) {
      event.target.setAttribute(CONSTANTS.attributes.disabled, true)
      event.preventDefault()
    } else {
      this.counter += 1
      targetForm.submit()
    }
  },

  bindEvents () {
    document.addEventListener(CONSTANTS.events.click, this.handleFormSubmit.bind(this))
  },
}

module.exports = PreventMultipleSubmits

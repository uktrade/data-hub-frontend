const CONSTANTS = {
  selectors: {
    button: 'button[type="submit"]',
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
    if (document.querySelectorAll(CONSTANTS.selectors.button).length) {
      this.bindEvents()
    }
  },

  handleFormSubmit (event) {
    const targetForm = event.target.closest(CONSTANTS.selectors.form)
    if (!targetForm ||
      event.target.type !== CONSTANTS.types.submit ||
      targetForm.classList.contains('js-AutoSubmit')) { return }

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

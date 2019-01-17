const getFormData = require('get-form-data').default
const pickBy = require('lodash/pickBy')
const XHR = require('../lib/xhr')
const { checkDateFormat } = require('../lib/helpers')

const AutoSubmit = {
  selector: '.js-AutoSubmit',
  isSubmitting: false,

  init () {
    this.bindEvents()
  },

  handleFormSubmit (evt) {
    if (evt.target.classList.contains('ie-date-field')) {
      if (!checkDateFormat(evt.target.value)) { return }
    }
    const targetForm = evt.target.closest('form')

    if (!targetForm) { return }

    const shouldSubmit = targetForm.classList.contains(this.selector.substring(1))

    if (shouldSubmit) {
      evt.preventDefault()
      this.submitForm(targetForm)
    }
  },

  bindEvents () {
    document.addEventListener('change', this.handleFormSubmit.bind(this))
    document.addEventListener('submit', this.handleFormSubmit.bind(this))
  },

  submitForm (form) {
    if (this.isSubmitting) { return }
    this.isSubmitting = true

    const query = pickBy(getFormData(form))

    XHR.request(form.action, query)
      .then(() => { this.isSubmitting = false })
      .catch((error) => {
        this.isSubmitting = false
        console.error(`Could not fetch data: ${error}`)
      })
  },
}

module.exports = AutoSubmit

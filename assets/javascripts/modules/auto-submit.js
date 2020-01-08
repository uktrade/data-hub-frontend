const getFormData = require('get-form-data').default
const pickBy = require('lodash/pickBy')
const XHR = require('../lib/xhr')
const { checkDateFormat } = require('../lib/helpers')

const AutoSubmit = {
  selector: '.js-AutoSubmit',
  isSubmitting: false,

  init() {
    this.bindEvents()
  },

  isCheckboxSynced(evt) {
    // This is needed because checkboxes can go out of sync with posted values. We prevent
    // this by reverting the checkbox to it's previous state if there is already a submit in progress.
    // This intentionally affects all checkboxes that trigger form submits site-wide.

    if (this.isSubmitting && evt.target.type === 'checkbox') {
      evt.target.checked = !evt.target.checked
      return
    }
    return true
  },

  handleFormSubmit(evt) {
    if (!this.isCheckboxSynced(evt)) return

    if (evt.target.classList.contains('ie-date-field')) {
      if (!checkDateFormat(evt.target.value)) {
        return
      }
    }
    const targetForm = evt.target.closest('form')

    if (!targetForm) {
      return
    }

    const shouldSubmit = targetForm.classList.contains(
      this.selector.substring(1)
    )

    if (shouldSubmit) {
      evt.preventDefault()
      this.submitForm(targetForm)
    }
  },

  bindEvents() {
    document.addEventListener('change', this.handleFormSubmit.bind(this))
    document.addEventListener('submit', this.handleFormSubmit.bind(this))
  },

  submitForm(form) {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true

    const query = pickBy(getFormData(form))

    XHR.request(form.action, query)
      .then(() => {
        this.isSubmitting = false
      })
      .catch((error) => {
        this.isSubmitting = false
        console.error(`Could not fetch data: ${error}`)
      })
  },
}

module.exports = AutoSubmit

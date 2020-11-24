const axios = require('axios')
const getFormData = require('get-form-data').default
const pickBy = require('lodash/pickBy')
const XHR = require('../lib/xhr')
const { checkDateFormat } = require('../lib/helpers')

const AutoSubmit = {
  selector: '.js-AutoSubmit',
  sources: [],

  init() {
    this.bindEvents()
  },

  handleFormSubmit(evt) {
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
    while (this.sources.length) {
      const source = this.sources.pop()
      source.cancel()
    }

    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    this.sources.push(source)

    const query = pickBy(getFormData(form))

    XHR.request(form.action, query, source.token)
  },
}

module.exports = AutoSubmit

const getFormData = require('get-form-data')
const pickBy = require('lodash/pickBy')

const XHR = require('../lib/xhr')

const AutoSubmit = {
  selector: '.js-AutoSubmit',
  actionsSelector: `.c-form-group--actions, .c-results__sort .button`,

  init () {
    this.bindEvents()
    this.hideActionButtons()
  },

  handleFormSubmit (evt) {
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

  hideActionButtons () {
    const formElements = Array.from(document.querySelectorAll(this.selector))
    if (!formElements.length) { return }

    formElements
      .map(form => form.querySelector(this.actionsSelector))
      .forEach(formAction => formAction.classList.add('u-hidden'))
  },

  submitForm (form) {
    if (!form) { return }

    const query = pickBy(getFormData(form))

    XHR
      .request(form.action, query)
      .then(() => this.hideActionButtons())
  },
}

module.exports = AutoSubmit

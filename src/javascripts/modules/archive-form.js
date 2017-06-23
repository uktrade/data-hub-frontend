const { hide, show, addClass, insertAfter } = require('../../lib/element-stuff')

/**
 * ArchiveForm
 *
 * Enhances the archive form so that it is hidden from view until shown by the user
 * and then when the user submits the form it carries out local validation before the form
 * can be submitted
 */
const ArchiveForm = {

  selector: '.js-archiveForm',

  init (wrapper = document) {
    this.wrapper = wrapper
    this.cacheElements()

    if (!this.archiveForm) { return }

    this.attachEvents()

    // If the form contains an error, show it expanded so the user
    // can see the error, otherwise hide it until asked to show it.
    if (this.errorElement) {
      this.showForm()
    } else {
      this.hideForm()
    }

    return this
  },

  /**
   *
   * Finds important elements for this component and caches them
   * to make it easier to use them
   */
  cacheElements () {
    this.archiveForm = this.wrapper.querySelector(this.selector)

    if (!this.archiveForm) { return }

    this.document = (typeof document !== 'undefined') ? document : this.archiveForm.ownerDocument
    this.archivedReasonLabel = this.archiveForm.querySelector('[for="archived_reason"]')
    this.reasonInputElement = this.archiveForm.querySelector('[name=archived_reason]')
    this.otherReasonTextInput = this.archiveForm.querySelector('[name=archived_reason_other]')
    this.fieldset = this.archiveForm.querySelector('fieldset')
    const saveButton = this.archiveForm.querySelector('[type="submit"]')

    this.errorElement = this.archiveForm.querySelector('.js-errorMessage')

    // Add buttons that should only be visable to JS users
    this.hideArchiveFormButton = this.createCancelButton()
    insertAfter(this.hideArchiveFormButton, saveButton)

    this.showArchiveFormButton = this.createShowButton()
    this.archiveForm.parentNode.insertBefore(this.showArchiveFormButton, this.archiveForm)
  },

  createShowButton () {
    const showArchiveFormButton = this.document.createElement('a')
    showArchiveFormButton.classList.add('button')
    showArchiveFormButton.href = '#'
    showArchiveFormButton.textContent = 'Archive'
    return showArchiveFormButton
  },

  createCancelButton () {
    const hideArchiveFormButton = this.document.createElement('a')
    hideArchiveFormButton.classList.add('button-link')
    hideArchiveFormButton.href = '#'
    hideArchiveFormButton.textContent = 'Cancel'

    return hideArchiveFormButton
  },

  /**
   * Attaches event handlers to key elements within the component.
   *
   */
  attachEvents () {
    this.showArchiveFormButton.addEventListener('click', this.showForm.bind(this), true)
    this.hideArchiveFormButton.addEventListener('click', this.hideForm.bind(this), true)
    this.archiveForm.addEventListener('submit', this.validateForm.bind(this), true)
  },

  /**
   * Shows an error, if one has not already been shown. Key styles are
   * added to make it obvious to the user that there is an issue
   *
   */
  showError () {
    if (this.errorElement) {
      return
    }

    this.errorElement = this.document.createElement('span')
    this.errorElement.classList.add('error-message')
    this.errorElement.textContent = 'You must provide a reason to archive.'

    this.archivedReasonLabel.appendChild(this.errorElement)
    addClass(this.fieldset, 'error')
  },

  /**
   * Make the archive form visible. If called from an event handler
   * then the default event behaviour is cancelled so that the browser does not
   * try and navigate to a url
   *
   * @param {object} event
   *
   */
  showForm (event) {
    if (event) {
      event.preventDefault()
    }

    hide(this.showArchiveFormButton)
    show(this.archiveForm)
  },

  /**
   * Hides the form if it is visible, normally then the user cancels the form
   * The event is cancelled to stop the page jumping.
   *
   * @param {any} event
   *
   */
  hideForm (event) {
    if (event) {
      event.preventDefault()
    }

    hide(this.archiveForm)
    show(this.showArchiveFormButton)
  },

  /**
   * Checks that the user has provided an archive reason, otherwise an error
   * is displayed and the form does not submit.
   *
   * @param {any} event
   *
   */
  validateForm (event) {
    if (this.reasonInputElement.value === '' ||
      (this.reasonInputElement.value.toLowerCase() === 'other' && this.otherReasonTextInput.value === '')) {
      this.showError()
      event.preventDefault()
      return false
    }
    return true
  },
}

module.exports = ArchiveForm

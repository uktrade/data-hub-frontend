/* eslint no-new: 0 */
const { hide, show, removeClass, addClass } = require('../../lib/element-stuff')

class ArchiveForm {
  constructor (element) {
    if (!element) return

    this.cacheElements(element)
    this.attachEvents()

    show(this.showArchiveFormButton)
    hide(this.archiveForm)

    this.dropdownChange()

    removeClass(this.archivePanelWrapper, 'js-hidden')
    this.showingError = false
  }

  cacheElements (element) {
    this.archivePanelWrapper = element
    this.showArchiveFormButton = this.archivePanelWrapper.querySelector('.archive-panel__show-button')
    this.hideArchiveFormButton = this.archivePanelWrapper.querySelector('.js-button-cancel')
    this.archiveForm = this.archivePanelWrapper.querySelector('.archive-panel__form')
    this.dropdownElement = this.archivePanelWrapper.querySelector('select[name=archived_reason]')
    this.otherTextWrapper = this.archivePanelWrapper.querySelector('#archived_reason_other-wrapper')
    this.otherTextInput = this.otherTextWrapper.querySelector('input')
  }

  showError () {
    if (this.showingError) return
    const label = this.archivePanelWrapper.querySelector('#archived_reason-wrapper label')
    label.innerHTML = label.innerHTML + '<span class="error-message">You cannot archive a company without a reason</span>'
    addClass(this.archivePanelWrapper, 'error')
    this.showingError = true
  }

  showFormClick (event) {
    event.preventDefault()
    hide(this.showArchiveFormButton)
    show(this.archiveForm)
  }

  hideFormClick (event) {
    event.preventDefault()
    hide(this.archiveForm)
    show(this.showArchiveFormButton)
  }

  dropdownChange () {
    const value = this.dropdownElement.value
    if (value === 'Other') {
      show(this.otherTextWrapper)
    } else {
      hide(this.otherTextWrapper)
      this.otherTextInput.value = ''
    }
  }

  validateForm (event) {
    if (this.dropdownElement.value === '' ||
      (this.dropdownElement.value === 'Other' && this.otherTextInput.value === '')) {
      this.showError()
      event.preventDefault()
      return false
    }

    return true
  }

  attachEvents () {
    this.showArchiveFormButton.addEventListener('click', this.showFormClick.bind(this), true)
    this.hideArchiveFormButton.addEventListener('click', this.hideFormClick.bind(this), true)
    this.dropdownElement.addEventListener('change', this.dropdownChange.bind(this), true)
    this.archiveForm.addEventListener('submit', this.validateForm, true)
  }

  static init () {
  // If this control is loaded on a real page, activate,
  // otherwise it's being used in a test container
    if (typeof document !== 'undefined') {
      new ArchiveForm(document.querySelector('.archive-panel'))
    }
  }
}

module.exports = ArchiveForm

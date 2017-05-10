/* eslint no-new: 0 */
const { hide, show, removeClass } = require('../lib/elementstuff')

class ArchiveForm {
  constructor (element) {
    if (!element) return

    this.cacheElements(element)
    this.attachEvents()

    show(this.showArchiveFormButton)
    hide(this.archiveForm)

    this.dropdownChange()

    removeClass(this.archivePanelWrapper, 'js-hidden')
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

  attachEvents () {
    this.showArchiveFormButton.addEventListener('click', this.showFormClick.bind(this), true)
    this.hideArchiveFormButton.addEventListener('click', this.hideFormClick.bind(this), true)
    this.dropdownElement.addEventListener('change', this.dropdownChange.bind(this), true)
  }
}

// If this control is loaded on a real page, activate,
// otherwise it's being used in a test container
if (typeof document !== 'undefined') {
  new ArchiveForm(document.querySelector('.archive-panel'))
}

module.exports = ArchiveForm

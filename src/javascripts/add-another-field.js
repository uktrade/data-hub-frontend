const { insertAfter } = require('../lib/element-stuff')
const { guid } = require('@uktrade/trade_elements')

class AddAnotherField {
  constructor (wrapperElement) {
    this.wrapperElement = wrapperElement
    this.addEventHandlers()
  }

  addEventHandlers () {
    this.wrapperElement.querySelector('.js-add_button')
      .addEventListener('click', this.handleAddFormGroup.bind(this), true)
  }

  /**
   * Handle select of add another button and duplicate the form control
   *
   *
   * @memberof AddAnotherField
   */
  handleAddFormGroup (event) {
    event.preventDefault()
    event.target.blur()

    const newId = guid()
    const formGroups = this.wrapperElement.querySelectorAll('.form-group')
    const lastFormGroup = formGroups.item(formGroups.length - 1)
    const newFormGroup = lastFormGroup.cloneNode(true)

    newFormGroup.querySelector('.form-label-bold').setAttribute('for', newId)
    const newFormControl = newFormGroup.querySelector('.form-control')
    newFormControl.setAttribute('id', newId)
    newFormControl.value = ''

    insertAfter(newFormGroup, lastFormGroup)
  }
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('.js-add-another-field')
    .forEach((element) => new AddAnotherField(element))
}

module.exports = AddAnotherField

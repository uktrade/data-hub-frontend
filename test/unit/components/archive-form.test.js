/* eslint no-new: 0 */
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const ArchiveForm = require('~/src/javascripts/modules/archive-form')
const { domTokenToArray } = require('~/test/component-helper')

const HTML = `
  <form action="/company/archive/f6a5beb3-d83e-e611-80e5-000d3a21b100" class="js-archiveForm" method="POST">
    <input type="hidden" name="_csrf" value="1234">
    <fieldset>
      <legend class="visually-hidden" aria-visible="false">Archive reason</legend>
      <div class='form-group' id="archived_reason-wrapper">
        <label class='form-label-bold' For='archived_reason'>Reason for archiving company</label>
        <select id="archived_reason" class="form-control" name="archived_reason">
          <option value=''>Select a value</option>
          <option value='Company is dissolved'>Company is dissolved</option>
          <option value='Other'>Other</option>
        </select>
      </div>
      <div class="form-group " id="archived_reason_other-wrapper">
        <label class="form-label-bold" for="archived_reason_other">Other</label>
        <input id="archived_reason_other" class="form-control" name="archived_reason_other" type="text" />
      </div>
    </fieldset>
    <div class="save-bar">
      <button class="button button--save" type="submit">Archive</button>
    </div>
  </form>
`
const event = {
  preventDefault: function () {},
}

describe('archive form control', function () {
  beforeEach(() => {
    const { window } = new JSDOM(HTML)
    this.document = window.document
    this.form = this.document.querySelector('.js-archiveForm')
    this.archiveFormControl = new ArchiveForm(this.form)
    this.otherWrapper = this.document.querySelector('#archived_reason_other-wrapper')
    this.otherField = this.document.querySelector('#archived_reason_other')
    this.dropdownField = this.document.querySelector('#archived_reason')
  })

  it('should hide the form initially', () => {
    expect(domTokenToArray(this.form.classList)).to.include('hidden')
  })

  it('should clear the js-hidden class once ready', () => {
    const fieldSet = this.form.querySelector('fieldset')
    expect(domTokenToArray(fieldSet.classList)).to.not.include('js-hidden')
  })

  it('it should add a button to reveal the form', () => {
    const prev = this.form.previousSibling
    expect(domTokenToArray(prev.classList)).to.include('button')
    expect(prev.textContent).to.include('Archive')
  })

  it('should show the reveal button', () => {
    const revealButton = this.form.previousSibling
    expect(domTokenToArray(revealButton.classList)).to.not.include('hidden')
  })

  it('should show the form when you press the reveal button', () => {
    const revealButton = this.form.previousSibling
    this.archiveFormControl.showForm(event)
    expect(domTokenToArray(this.form.classList)).to.not.include('hidden')
    expect(domTokenToArray(revealButton.classList)).to.include('hidden')
  })

  it('hide the form when you press cancel', () => {
    const revealButton = this.form.previousSibling
    this.archiveFormControl.hideForm(event)
    expect(domTokenToArray(this.form.classList)).to.include('hidden')
    expect(domTokenToArray(revealButton.classList)).to.not.include('hidden')
  })

  it('should hide the other field when the form is revealed if it has no value', () => {
    this.archiveFormControl.showForm(event)
    expect(domTokenToArray(this.otherWrapper.classList)).to.include('hidden')
  })

  it('should show the other field when the form is revealed and it has a value', () => {
    this.otherField.value = 'Fred'
    this.archiveFormControl.showForm(event)
    expect(domTokenToArray(this.otherWrapper.classList)).to.include('hidden')
  })

  it('should show the other field if the dropdown changes to other', () => {
    this.dropdownField.value = 'Other'
    this.archiveFormControl.reasonUpdate()
    expect(domTokenToArray(this.otherWrapper.classList)).to.not.include('hidden')
  })

  it('should hide the other field if the dropdown changes to other then back to a valid value', () => {
    this.dropdownField.value = 'Other'
    this.archiveFormControl.reasonUpdate()
    this.dropdownField.value = 'Company is dissolved'
    this.archiveFormControl.reasonUpdate()
    expect(domTokenToArray(this.otherWrapper.classList)).to.include('hidden')
  })

  it('should clear the other value if the field is not needed', () => {
    this.dropdownField.value = 'Other'
    this.otherField.value = 'Something'
    this.archiveFormControl.reasonUpdate()
    this.dropdownField.value = 'Company is dissolved'
    this.archiveFormControl.reasonUpdate()
    expect(this.otherField.value).to.include('')
  })

  it('should alert the user if then try to submit a form with no value', () => {
    const valid = this.archiveFormControl.validateForm(event)
    expect(valid).to.equal(false)

    const fieldsetElement = this.form.querySelector('fieldset')
    expect(domTokenToArray(fieldsetElement.classList)).to.include('error')
    const errorMessage = this.document.querySelector('#archived_reason-wrapper .form-label-bold .error-message')
    expect(errorMessage).to.not.be.null
    expect(errorMessage.textContent).to.include('You must provide a reason to archive.')
  })

  it('should not add 2 errors if you try to submit bad data twice', () => {
    this.archiveFormControl.validateForm(event)
    this.archiveFormControl.validateForm(event)
    const errorMessages = this.document.querySelectorAll('#archived_reason-wrapper .form-label-bold .error-message')
    expect(errorMessages.length).to.equal(1)
  })

  it('should indicate that a form passes validation when an option is selected', () => {
    this.dropdownField.value = 'Company is dissolved'
    const valid = this.archiveFormControl.validateForm(event)
    expect(valid).to.equal(true)
  })

  it('should indicate that a form passes validation when an other value is selected', () => {
    this.dropdownField.value = 'Other'
    this.otherField.value = 'something'
    const valid = this.archiveFormControl.validateForm(event)
    expect(valid).to.equal(true)
  })
})

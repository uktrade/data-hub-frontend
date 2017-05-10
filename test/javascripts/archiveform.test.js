/* globals expect: true, describe: true, it: true, beforeEach: true */
/* eslint no-new: 0, no-unused-expressions: 0 */
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const ArchiveForm = require('../../src/javascripts/archiveform')

const HTML = `
  <div class="archive-panel js-hidden">
    <p class="hidden archive-panel__show-button" aria-hidden="true">
      <a href="#">Archive company</a>
    </p>
    <form action="/company/archive/f6a5beb3-d83e-e611-80e5-000d3a21b100" class="section archive-panel__form " method="POST">
      <input type="hidden" name="_csrf_token" value="5481c30c-dd08-0b47-32d9-50b16fefb59e">
      <div class='form-group ' id="archived_reason-wrapper">
        <label class='form-label-bold' For='archived_reason'>Reason for archiving company</label>
        <select id="archived_reason" class='form-control' name='archived_reason'>
          <option value=''>Select a value</option>
          <option value='Company is dissolved'>Company is dissolved</option>
          <option value='Other'>Other</option>
        </select>
      </div>
      <div class="form-group " id="archived_reason_other-wrapper">
        <label class="form-label-bold" for="archived_reason_other">Other</label>
        <input id="archived_reason_other" class="form-control" name="archived_reason_other" type="text" />
      </div>
      <div class="save-bar">
        <button class="button button--save" type="submit">Archive</button>
        <a class="button-link button--cancel js-button-cancel" href="/company/view/foreign/f6a5beb3-d83e-e611-80e5-000d3a21b100">Cancel</a>
      </div>
    </form>
  </div>
`
const event = {
  preventDefault: function () {}
}

function domTokenToArray (obj) {
  let array = []
  // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}

describe('archive form control', function () {
  let document
  let archiveFormControl
  let dropdownField
  let otherField
  let form
  let showButton
  let otherWrapper
  let wrapper

  beforeEach(function () {
    const { window } = new JSDOM(HTML)
    document = window.document
    wrapper = document.querySelector('.archive-panel')
    archiveFormControl = new ArchiveForm(wrapper)
    form = document.querySelector('.archive-panel__form')
    showButton = document.querySelector('.archive-panel__show-button')
    otherWrapper = document.querySelector('#archived_reason_other-wrapper')
    otherField = document.querySelector('#archived_reason_other')
    dropdownField = document.querySelector('#archived_reason')
  })

  it('should hide the form', function () {
    expect(domTokenToArray(form.classList)).to.include('hidden')
  })
  it('should show the reveal button', function () {
    expect(domTokenToArray(showButton.classList)).to.not.include('hidden')
  })
  it('should show the form when you press the show button', function () {
    archiveFormControl.showFormClick(event)
    expect(domTokenToArray(form.classList)).to.not.include('hidden')
    expect(domTokenToArray(showButton.classList)).to.include('hidden')
  })
  it('hide the form when you press cancel', function () {
    archiveFormControl.hideFormClick(event)
    expect(domTokenToArray(form.classList)).to.include('hidden')
    expect(domTokenToArray(showButton.classList)).to.not.include('hidden')
  })
  it('should hide the other field by default', function () {
    expect(domTokenToArray(otherWrapper.classList)).to.include('hidden')
  })
  it('should show the other field if the dropdown changes to other', function () {
    dropdownField.value = 'Other'
    archiveFormControl.dropdownChange()
    expect(domTokenToArray(otherWrapper.classList)).to.not.include('hidden')
  })
  it('should hide the other field if the dropdown changes to other then back to a valid value', function () {
    dropdownField.value = 'Other'
    archiveFormControl.dropdownChange()
    dropdownField.value = 'Company is dissolved'
    archiveFormControl.dropdownChange()
    expect(domTokenToArray(otherWrapper.classList)).to.include('hidden')
  })
  it('should clear the other value if the field is not needed', function () {
    dropdownField.value = 'Other'
    otherField.value = 'Something'
    archiveFormControl.dropdownChange()
    dropdownField.value = 'Company is dissolved'
    archiveFormControl.dropdownChange()
    expect(otherField.value).to.include('')
  })
  it('removes the js hidden class, used to avoid flicker when the page starts', function () {
    expect(domTokenToArray(wrapper.classList)).to.not.include('js-hidden')
  })
  it('should alert the user if then try to submit a form with no value', function () {
    const valid = archiveFormControl.validateForm(event)

    expect(valid).to.equal(false)
    expect(domTokenToArray(wrapper.classList)).to.include('error')
    const errorMessage = document.querySelector('#archived_reason-wrapper .form-label-bold .error-message')
    expect(errorMessage).to.not.be.null
    expect(errorMessage.textContent).to.include('You cannot archive a company without a reason')
  })
  it('should not add 2 errors if you try to submit bad data twice', function () {
    archiveFormControl.validateForm(event)
    archiveFormControl.validateForm(event)
    const errorMessages = document.querySelectorAll('#archived_reason-wrapper .form-label-bold .error-message')
    expect(errorMessages.length).to.equal(1)
  })
  it('should indicate that a form passes validation when an option is selected', function () {
    dropdownField.value = 'Company is dissolved'
    const valid = archiveFormControl.validateForm(event)
    expect(valid).to.equal(true)
  })
  it('should indicate that a form passes validation when an other value is selected', function () {
    dropdownField.value = 'Other'
    otherField.value = 'something'
    const valid = archiveFormControl.validateForm(event)
    expect(valid).to.equal(true)
  })
})

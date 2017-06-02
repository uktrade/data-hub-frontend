const jsdom = require('jsdom')
const { JSDOM } = jsdom
const AddAnotherField = require('~/src/javascripts/add-another-field')

const HTML = `
  <div class="country-list js-add-another-field">
    <div class="form-group">
      <label class="form-label-bold">Test dropdown</label>
      <select name="test" class="form-control">
        <option value="">Select an option</option>
        <option value="one">One</option>
        <option value="two">Two</option>
      </select>
      <a class="button-link js-add_button" href="addcountry">Add another country</a>
    </div>
  </div>`

describe('Add another field', function () {
  let document
  let wrapper
  let addAnotherField
  let event

  beforeEach(function () {
    const { window } = new JSDOM(HTML)
    document = window.document
    wrapper = document.querySelector('.js-add-another-field')
    addAnotherField = new AddAnotherField(wrapper)
    event = {
      target: {
        blur: sinon.stub()
      },
      preventDefault: sinon.stub()
    }
  })

  it('should create a new country dropdown when the add button is pressed', function () {
    addAnotherField.handleAddFormGroup(event)
    const dropDowns = document.querySelectorAll('select.form-control')
    expect(dropDowns).to.have.length(2)
  })

  it('should ensure the new country dropdown value is reset', function () {
    addAnotherField.handleAddFormGroup(event)
    const dropDowns = document.querySelectorAll('select.form-control')
    const lastDropdown = dropDowns.item(1)
    expect(lastDropdown.selectedIndex).to.equal(0)
  })

  it('should allocate a unique ID to the field', function () {
    addAnotherField.handleAddFormGroup(event)
    const dropDowns = document.querySelectorAll('select.form-control')
    const firstDropdown = dropDowns.item(0)
    const secondDropdown = dropDowns.item(1)
    expect(firstDropdown.id).to.not.equal(secondDropdown.id)
  })

  it('should associate the new label with the new field', function () {
    addAnotherField.handleAddFormGroup(event)
    const newFormGroup = document.querySelectorAll('.form-group').item(1)
    const newLabel = newFormGroup.querySelector('.form-label-bold')
    const newDropdown = newFormGroup.querySelector('.form-control')
    expect(newLabel.getAttribute('for')).to.equal(newDropdown.id)
  })

  it('should make sure clicking the add button doesnt goto a page', function () {
    addAnotherField.handleAddFormGroup(event)
    expect(event.preventDefault).to.have.been.called
  })
})

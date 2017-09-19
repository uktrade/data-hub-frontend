const { getMacros } = require('~/test/unit/macro-helper')
const macros = getMacros('form')

describe('AddAnother component', () => {
  beforeEach(() => {
    this.component = macros.renderToDom('AddAnother', {
      buttonName: 'add_another',
      name: 'add_another',
      label: 'Add another',
      children: [
        {
          macroName: 'MultipleChoiceField',
          name: 'add_another',
          label: 'Add another',
          isLabelHidden: true,
          optional: true,
          initialOption: '-- Select another --',
          options: [
            { value: 1, label: 'another 1' },
            { value: 2, label: 'another 2' },
            { value: 3, label: 'another 3' },
          ],
        },
      ],
      value: [1, 2],
    })
  })

  it('should render a component with 2 preselected drop downs', () => {
    const selectedElements = this.component.getElementsByTagName('select')

    expect(selectedElements[0].value).to.equal('1')
    expect(selectedElements[1].value).to.equal('2')
  })

  it('should render a component with 1 unselected drop down', () => {
    const selectElements = this.component.getElementsByTagName('select')

    expect(selectElements[2].value).to.equal('')
  })

  it('should render a component with an "Add another" button', () => {
    const addAnotherButton = this.component.querySelectorAll('input[type=submit]')

    expect(addAnotherButton[0].value).to.equal('Add another')
  })
})

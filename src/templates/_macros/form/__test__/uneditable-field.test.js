const { getMacros } = require('../../../../../test/unit/macro-helper')

const uneditableField = getMacros('form/uneditable-field')

describe('Uneditable field macro', () => {
  context('when there are no props', () => {
    beforeEach(() => {
      this.component = uneditableField.renderToDom('UneditableField', {})
    })

    it('should not render a component', () => {
      expect(this.component).to.not.exist
    })
  })

  context('when there is all props', () => {
    beforeEach(() => {
      this.component = uneditableField.renderToDom('UneditableField', {
        name: 'uneditable_field',
        label: 'Uneditable field',
        value: 'Uneditable value',
        url: '/url',
      })
    })

    it('should render a form group', () => {
      expect(this.component.className.trim()).to.equal('c-form-group')
    })

    it('should give the form group an id attribute', () => {
      expect(this.component.getAttribute('id')).to.equal('group-field-uneditable_field')
    })

    it('should render a label', () => {
      expect(this.component.querySelector('.c-form-group__label-text').textContent.trim()).to.equal('Uneditable field')
    })

    it('should render the value', () => {
      expect(this.component.querySelector('.c-form-group__inner p').textContent.trim()).to.equal('Uneditable value Change')
    })

    it('should render a "Change" link', () => {
      const changeLink = this.component.querySelector('a')

      expect(changeLink.textContent.trim()).to.equal('Change')
      expect(changeLink.getAttribute('href')).to.equal('/url')
    })
  })
})

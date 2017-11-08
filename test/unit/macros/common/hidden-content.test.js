const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

const summaryMock = 'Do you want to see more text?'
const textMock = 'Extra text to reveal'
const propsMock = {
  summary: summaryMock,
  text: textMock,
}

describe('HiddenContent macro', () => {
  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = commonMacros.renderToDom('HiddenContent')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    context('items prop', () => {
      beforeEach(() => {
        this.component = commonMacros.renderToDom('HiddenContent', propsMock)
      })

      it('should render a details element', () => {
        expect(this.component.tagName.toLowerCase()).to.equal('details')
      })

      it('should render a correct summary', () => {
        const summary = this.component.querySelector('.details__summary')
        expect(summary.textContent).to.equal(summaryMock)
      })

      it('should render correct contents', () => {
        const content = this.component.querySelector('.details__content')
        expect(content.textContent).to.equal(textMock)
      })
    })

    context('caller', () => {
      beforeEach(() => {
        this.customHTML = '<span>Custom html</span>'
        this.component = commonMacros.renderWithCallerToDom('HiddenContent', propsMock)(this.customHTML)
      })

      it('should render custom body', () => {
        const content = this.component.querySelector('.details__content')
        expect(content.innerHTML.trim()).to.equal(this.customHTML)
      })
    })
  })
})

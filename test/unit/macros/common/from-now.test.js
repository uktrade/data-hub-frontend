const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

describe('FromNow macro', () => {
  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = commonMacros.renderToDom('FromNow')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    beforeEach(() => {
      this.component = commonMacros.renderToDom('FromNow', {
        datetime: '2010-08-01',
      })
    })

    it('should render time element', () => {
      expect(this.component.tagName.toLowerCase()).to.equal('time')
    })

    it('should contain datetime attribute', () => {
      expect(this.component.hasAttribute('datetime')).to.equal(true)
    })

    it('should format datetime attribute to local datetime', () => {
      expect(this.component.getAttribute('datetime')).to.equal('2010-08-01T00:00:00+01:00')
    })

    it('should contain title attribute', () => {
      expect(this.component.hasAttribute('title')).to.equal(true)
    })

    it('should format title attribute to default datetime format', () => {
      expect(this.component.getAttribute('title')).to.equal('1 Aug 2010, 12:00am')
    })
  })
})

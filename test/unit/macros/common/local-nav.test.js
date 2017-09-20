const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

describe('LocalNav macro', () => {
  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = commonMacros.renderToDom('LocalNav')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    it('should render local nav', () => {
      const component = commonMacros.renderToDom('LocalNav', {
        items: [
          { path: '/first-item', label: 'First item' },
          { path: '/second-item', label: 'Second item' },
        ],
      })
      expect(component.className.trim()).to.equal('c-local-nav')
      expect(component.querySelectorAll('.c-local-nav__link')).to.have.length(2)
    })

    it('should render local nav with currently selected item', () => {
      const component = commonMacros.renderToDom('LocalNav', {
        items: [
          { path: '/first-item', label: 'First item', isActive: true },
          { path: '/second-item', label: 'Second item' },
        ],
      })
      expect(component.className.trim()).to.equal('c-local-nav')
      expect(component.querySelectorAll('.c-local-nav__link.is-active')).to.have.length(1)
    })
  })
})

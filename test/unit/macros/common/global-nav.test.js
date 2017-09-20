const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

describe('GlobalNav macro', () => {
  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = commonMacros.renderToDom('GlobalNav')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    it('should render local nav', () => {
      const component = commonMacros.renderToDom('GlobalNav', {
        items: [
          { path: '/first-item', label: 'First item' },
          { path: '/second-item', label: 'Second item' },
        ],
      })
      expect(component.className.trim()).to.equal('c-global-nav')
      expect(component.querySelectorAll('.c-global-nav__link')).to.have.length(2)
    })

    it('should render local nav with currently selected item', () => {
      const component = commonMacros.renderToDom('GlobalNav', {
        items: [
          { path: '/first-item', label: 'First item', isActive: true },
          { path: '/second-item', label: 'Second item' },
        ],
      })
      expect(component.className.trim()).to.equal('c-global-nav')
      expect(component.querySelectorAll('.c-global-nav__link.is-active')).to.have.length(1)
    })

    it('should render a string modifier', () => {
      const component = commonMacros.renderToDom('GlobalNav', {
        items: [
          { path: '/first-item', label: 'First item', isActive: true },
        ],
        modifier: 'modifier',
      })

      expect(component.className.trim()).to.equal('c-global-nav c-global-nav--modifier')
    })

    it('should render an array of modifiers', () => {
      const component = commonMacros.renderToDom('GlobalNav', {
        items: [
          { path: '/first-item', label: 'First item', isActive: true },
        ],
        modifier: ['modifier-1', 'modifier-2'],
      })

      expect(component.className.trim()).to.equal('c-global-nav c-global-nav--modifier-2 c-global-nav--modifier-1')
    })
  })
})

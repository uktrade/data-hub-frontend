const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

const data = [{
  url: '/',
  name: 'Home',
}, {
  url: '/second-level',
  name: 'Second level',
}, {
  url: '/second-level/third-level',
  name: 'Third level',
}]

describe('Breadcrumb component', () => {
  describe('when no data is supplied', () => {
    it('should not render', () => {
      const component = commonMacros.renderToDom('Breadcrumbs')
      expect(component).to.be.null
    })
  })

  describe('when only 1 item is supplied', () => {
    it('should not render', () => {
      const component = commonMacros.renderToDom('Breadcrumbs', {
        items: [{
          url: '/',
          name: 'Home',
        }],
      })
      expect(component).to.be.null
    })
  })

  describe('when more than 2 items are supplied', () => {
    beforeEach(() => {
      this.component = commonMacros.renderToDom('Breadcrumbs', { items: data })
    })

    it('should render 2 items', () => {
      const items = this.component.querySelectorAll('.c-breadcrumb__list-item')
      expect(items.length).to.equal(3)
    })

    it('should contain the correct text', () => {
      const items = this.component.querySelectorAll('.c-breadcrumb__list-item')
      expect(items[0].textContent).to.contain('Home')
      expect(items[1].textContent).to.contain('Second level')
      expect(items[2].textContent).to.contain('Third level')
    })

    it('should contain the correct links', () => {
      const items = this.component.querySelectorAll('.c-breadcrumb__link')
      expect(items[0].getAttribute('href')).to.equal('/')
      expect(items[1].getAttribute('href')).to.equal('/second-level')
      expect(items[2].getAttribute('href')).to.equal('#main-content')
    })

    it('should set active class only on the last item', () => {
      const items = this.component.querySelectorAll('.c-breadcrumb__link')
      expect(items[0].className).not.to.contain('is-active')
      expect(items[1].className).not.to.contain('is-active')
      expect(items[2].className).to.contain('is-active')
    })
  })
})

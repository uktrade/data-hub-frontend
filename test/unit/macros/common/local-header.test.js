const { getMacros } = require('~/test/unit/macro-helper')

describe('LocalHeader macro', () => {
  beforeEach(() => {
    this.commonMacros = getMacros('common', {
      getMessages: sandbox.stub(),
    })
  })

  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = this.commonMacros.renderToDom('LocalHeader')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    it('should render page heading', () => {
      const component = this.commonMacros.renderToDom('LocalHeader', {
        heading: 'I am hot',
      })
      expect(component.className.trim()).to.equal('c-local-header')
      expect(component.querySelector('.c-local-header__heading').textContent.trim()).to.equal('I am hot')
    })

    it('should render local header with custom modifier', () => {
      const component = this.commonMacros.renderToDom('LocalHeader', {
        modifier: ['azure'],
      })
      expect(component.className).to.contain('c-local-header--azure')
    })

    it('should render local header with multiple custom modifiers', () => {
      const component = this.commonMacros.renderToDom('LocalHeader', {
        modifier: ['beautiful', 'azure'],
      })
      expect(component.className).to.contain.all('c-local-header--beautiful', 'c-local-header--azure')
    })

    it('should render local header with breadcrumbs', () => {
      const component = this.commonMacros.renderToDom('LocalHeader', {
        breadcrumbs: [
          {
            name: 'Home',
            url: '/',
          }, {
            name: 'Second level',
            url: '/second-level',
          },
        ],
      })

      const breadcrumbItems = component.querySelectorAll('.c-breadcrumb__list-item')
      expect(component.querySelector('.c-breadcrumb')).to.exist
      expect(breadcrumbItems).to.have.length(2)
      expect(breadcrumbItems[0].querySelector('a').getAttribute('href')).to.equal('/')
      expect(breadcrumbItems[0].querySelector('a').textContent.trim()).to.equal('Home')
      expect(breadcrumbItems[1].querySelector('a').getAttribute('href')).to.equal('#main-content')
      expect(breadcrumbItems[1].querySelector('a').textContent.trim()).to.equal('Second level')
    })
  })

  it('should render local header with flash message', () => {
    const component = this.commonMacros.renderToDom('LocalHeader', {
      messages: {
        error: ['Error message'],
        success: ['Success message'],
      },
    })

    const messagesEls = component.querySelectorAll('.c-message')
    expect(component.querySelector('.c-message-list')).to.exist
    expect(messagesEls[0].className).to.contain('c-message--error')
    expect(messagesEls[0].textContent).to.equal('Error message')
    expect(messagesEls[1].className).to.contain('c-message--success')
    expect(messagesEls[1].textContent).to.equal('Success message')
  })

  it('should render local header with string heading heading', () => {
    const component = this.commonMacros.renderToDom('LocalHeader', {
      headingBefore: '<strong>Superb</strong>',
    })

    const headingBeforeEl = component.querySelector('.c-local-header__heading-before')
    expect(headingBeforeEl).to.exist
    expect(headingBeforeEl.querySelector('strong').textContent.trim()).to.equal('Superb')
  })

  it('should render local header with string heading suffix', () => {
    const component = this.commonMacros.renderToDom('LocalHeader', {
      heading: 'Tyom',
      headingSuffix: '<strong>S</strong>',
    })

    const headingEl = component.querySelector('.c-local-header__heading')
    expect(headingEl).to.exist
    expect(headingEl.textContent.trim()).to.equal('Tyom S')
    expect(headingEl.querySelector('strong').textContent.trim()).to.equal('S')
  })
})

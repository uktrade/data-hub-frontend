const { getMacros } = require('test/unit/macro-helper')

describe('LocalHeader macro', () => {
  beforeEach(() => {
    this.commonMacros = getMacros('common', {
      getMessages: sinon.stub(),
      getBreadcrumbs: sinon.stub(),
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

const { getMacros } = require('~/test/unit/macro-helper')
const commonMacros = getMacros('common')

const text = 'Informative message'
const items = {
  info: ['First informative message', 'Second informative message'],
  warning: ['Warning message'],
  error: ['First error message', 'Second error message'],
  muted: ['Muted message'],
}

describe('Message macro', () => {
  describe('invalid props', () => {
    it('should not render if props is not given', () => {
      const component = commonMacros.renderToDom('Message')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    context('items prop', () => {
      beforeEach(() => {
        this.component = commonMacros.renderToDom('Message', {
          text,
        })
      })

      it('should render item text', () => {
        expect(this.component.textContent).to.equal(text)
      })

      it('should render default tag name', () => {
        expect(this.component.tagName.toLowerCase()).to.equal('p')
      })

      it('should show no modifier class', () => {
        expect(this.component.className.trim()).to.equal('c-message')
      })
    })

    context('caller', () => {
      beforeEach(() => {
        this.customHTML = '<span>Custom html</span>'
        this.component = commonMacros.renderWithCallerToDom('Message')(this.customHTML)
      })

      it('should render custom body', () => {
        expect(this.component.innerHTML.trim()).to.equal(this.customHTML)
      })
    })
  })

  describe('customise component', () => {
    context('with type', () => {
      it('should use type as modifier class', () => {
        const component = commonMacros.renderToDom('Message', {
          text,
          type: 'error',
        })

        expect(component.className.trim()).to.equal('c-message c-message--error')
      })
    })

    context('with element', () => {
      it('should use element as tag name', () => {
        const component = commonMacros.renderToDom('Message', {
          text,
          element: 'div',
        })

        expect(component.tagName.toLowerCase()).to.equal('div')
      })
    })
  })
})

describe('MessageList macro', () => {
  describe('invalid props', () => {
    context('no props provided', () => {
      it('should not render', () => {
        const component = commonMacros.renderToDom('MessageList')
        expect(component).to.be.null
      })
    })

    context('items is empty array', () => {
      it('should not render', () => {
        const component = commonMacros.renderToDom('MessageList', {
          items: [],
        })
        expect(component).to.be.null
      })
    })
  })

  describe('valid props', () => {
    context('items prop', () => {
      beforeEach(() => {
        this.component = commonMacros.renderToDom('MessageList', {
          items,
        })
      })

      it('should render a parent ul element', () => {
        expect(this.component.tagName.toLowerCase()).to.equal('ul')
      })

      it('should render correct amount of items', () => {
        const messages = this.component.querySelectorAll('.c-message')
        expect(messages).to.have.lengthOf(6)
      })

      it('should render each message as an li', () => {
        const message = this.component.querySelector('.c-message')
        expect(message.tagName.toLowerCase()).to.equal('li')
      })

      it('should be dismissable', () => {
        expect(this.component.className.trim()).to.equal('c-message-list js-Messages')
      })
    })
  })

  describe('customise component', () => {
    context('not dismissable', () => {
      it('should not be dismissable', () => {
        const component = commonMacros.renderToDom('MessageList', {
          items,
          isDismissable: false,
        })

        expect(component.className.trim()).to.equal('c-message-list')
      })
    })
  })
})

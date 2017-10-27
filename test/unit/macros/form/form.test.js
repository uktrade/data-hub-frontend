const { getMacros } = require('~/test/unit/macro-helper')
const macros = getMacros('form')

describe('Form component', () => {
  describe('invalid call', () => {
    it('should not render without caller', () => {
      const component = macros.renderWithCallerToDom('Form')()
      expect(component).to.be.null
    })
  })

  describe('valid call', () => {
    it('should render a `post` form by default', () => {
      const component = macros.renderWithCallerToDom('Form')(
        macros.renderToDom('TextField'),
      )
      expect(component.method).to.equal('post')
    })

    it('should render with submit button by default', () => {
      const component = macros.renderWithCallerToDom('Form')(
        macros.renderToDom('TextField'),
      )
      expect(component.querySelector('.c-form-actions')).to.exist
      expect(component.querySelector('button.button').textContent).to.equal('Submit')
    })

    it('should render form with custom props', () => {
      const formProps = {
        method: 'get',
        action: '/form-url',
        role: 'search',
        class: 'c-form-component',
        actionsClass: 'u-js-hidden',
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      expect(component.method).to.equal('get')
      expect(component.action).to.equal('/form-url')
      expect(component.className).to.equal('c-form-component')
      expect(component.getAttribute('role')).to.equal('search')
      expect(component.querySelector('.c-form-actions').classList.contains('u-js-hidden')).to.be.true
    })

    it('should render form with custom submit button text', () => {
      const formProps = {
        buttonText: 'Save',
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      expect(component.querySelector('button.button').textContent).to.equal('Save')
    })

    it('should render form without form actions', () => {
      const formProps = {
        hideFormActions: true,
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      expect(component.querySelector('.c-form-actions')).to.not.exist
    })

    it('should render form without submit button', () => {
      const formProps = {
        hidePrimaryFormAction: true,
        returnLink: '/previous-page',
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      const returnLink = component.querySelector('[href="/previous-page"]')
      expect(returnLink).to.exist
      expect(returnLink.textContent).to.equal('Back')
      expect(component.querySelector('.c-form-actions .button')).to.not.exist
    })

    it('should render form with button modifier as string', () => {
      const formProps = {
        buttonModifiers: 'modifier',
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      expect(component.querySelector('button.button').classList.contains('modifier')).to.be.true
    })

    it('should render form with button modifier as array', () => {
      const formProps = {
        buttonModifiers: ['modifier-1', 'modifier-2'],
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      const classList = component.querySelector('button.button').classList

      expect(classList.contains('modifier-1')).to.be.true
      expect(classList.contains('modifier-2')).to.be.true
    })

    it('should render form with return link', () => {
      const formProps = {
        returnLink: '/previous-page',
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      const returnLink = component.querySelector('[href="/previous-page"]')
      expect(returnLink).to.exist
      expect(returnLink.textContent).to.equal('Back')
    })

    it('should render form with custom text for return link', () => {
      const formProps = {
        returnLink: '/previous-page',
        returnText: 'Go back',
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )
      expect(component.querySelector('[href="/previous-page"]').textContent).to.equal('Go back')
    })

    it('should render form with hidden fields', () => {
      const formProps = {
        hiddenFields: {
          'csrf': 'abcd',
          'company-id': '12345',
        },
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )

      const hiddenInputs = component.querySelectorAll('[type="hidden"]')
      expect(hiddenInputs[0].name).to.equal('csrf')
      expect(hiddenInputs[0].value).to.equal('abcd')
      expect(hiddenInputs[1].name).to.equal('company-id')
      expect(hiddenInputs[1].value).to.equal('12345')
    })

    it('should render form errors component', () => {
      const formProps = {
        errors: {
          summary: 'Error summary',
          messages: {
            field_name: 'Error message',
            another_field_name: 'Another error message',
          },
        },
      }
      const component = macros.renderWithCallerToDom('Form', formProps)(
        macros.renderToDom('TextField'),
      )

      const formErrorsEl = component.querySelector('.c-error-summary')
      const formErrorsMessagesEls = formErrorsEl.querySelectorAll('.c-error-summary__list-item')
      expect(formErrorsEl).to.exist
      expect(formErrorsEl.querySelector('.c-error-summary__summary').textContent.trim()).to.equal('Error summary')
      expect(formErrorsMessagesEls).to.have.length(2)
      expect(formErrorsMessagesEls[0].textContent.trim()).to.equal('Error message')
      expect(formErrorsMessagesEls[1].textContent.trim()).to.equal('Another error message')
    })
  })
})

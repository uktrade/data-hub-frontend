const { getMacros } = require('~/test/unit/macro-helper')

describe('Nunjucks form macros', () => {
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
          macros.renderToDom('TextField')
        )
        expect(component.method).to.equal('post')
      })

      it('should render with submit button by default', () => {
        const component = macros.renderWithCallerToDom('Form')(
          macros.renderToDom('TextField')
        )
        expect(component.querySelector('.c-form-group--actions')).to.exist
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
          macros.renderToDom('TextField')
        )
        expect(component.method).to.equal('get')
        expect(component.action).to.equal('/form-url')
        expect(component.className).to.equal('c-form-component')
        expect(component.getAttribute('role')).to.equal('search')
        expect(component.querySelector('.c-form-group--actions').classList.contains('u-js-hidden')).to.be.true
      })

      it('should render form with custom submit button text', () => {
        const formProps = {
          buttonText: 'Save',
        }
        const component = macros.renderWithCallerToDom('Form', formProps)(
          macros.renderToDom('TextField')
        )
        expect(component.querySelector('button.button').textContent).to.equal('Save')
      })

      it('should render form without submit button', () => {
        const formProps = {
          hideFormActions: true,
        }
        const component = macros.renderWithCallerToDom('Form', formProps)(
          macros.renderToDom('TextField')
        )
        expect(component.querySelector('.c-form-group--actions')).to.not.exist
      })

      it('should render form with return link', () => {
        const formProps = {
          returnLink: '/previous-page',
        }
        const component = macros.renderWithCallerToDom('Form', formProps)(
          macros.renderToDom('TextField')
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
          macros.renderToDom('TextField')
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
          macros.renderToDom('TextField')
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
          macros.renderToDom('TextField')
        )

        const formErrorsEl = component.querySelector('.c-form-errors')
        const formErrorsMessagesEls = formErrorsEl.querySelectorAll('.c-form-errors__list-item')
        expect(formErrorsEl).to.exist
        expect(formErrorsEl.querySelector('.c-form-errors__summary').textContent.trim()).to.equal('Error summary')
        expect(formErrorsMessagesEls).to.have.length(2)
        expect(formErrorsMessagesEls[0].textContent.trim()).to.equal('Error message')
        expect(formErrorsMessagesEls[1].textContent.trim()).to.equal('Another error message')
      })
    })
  })

  describe('TextField component', () => {
    describe('invalid props', () => {
      it('should not render without props', () => {
        const component = macros.renderToDom('TextField')
        expect(component).to.be.null
      })

      it('should not render if label is not provided', () => {
        const component = macros.renderToDom('TextField', {
          name: 'firstName',
        })
        expect(component).to.be.null
      })

      it('should not render if name is not provided', () => {
        const component = macros.renderToDom('TextField', {
          label: 'First name',
        })
        expect(component).to.be.null
      })
    })

    describe('valid props', () => {
      beforeEach(() => {
        this.component = macros.renderToDom('TextField', {
          name: 'firstName',
          label: 'First name',
          value: 'Joe',
        })
      })

      it('should render a component with group id', () => {
        expect(this.component.id).to.equal('group-field-firstName')
      })

      it('should render a component with correct group class name', () => {
        expect(this.component.className.trim()).to.equal('c-form-group')
      })

      it('should render a component with label and input field', () => {
        expect(this.component.querySelector('label').textContent.trim()).to.equal('First name')
        expect(this.component.querySelector('input')).to.not.be.null
      })

      it('should render a component which has input with name and id based on its name', () => {
        expect(this.component.querySelector('input').name).to.equal('firstName')
        expect(this.component.querySelector('input').id).to.equal('field-firstName')
      })

      it('should render a component with text input by default', () => {
        expect(this.component.querySelector('input').type).to.equal('text')
      })

      it('should render a field with value given', () => {
        expect(this.component.querySelector('input').value).to.equal('Joe')
      })
    })

    describe('customise component', () => {
      it('should render textarea field when given type "textarea"', () => {
        const component = macros.renderToDom('TextField', {
          type: 'textarea',
          name: 'description',
          label: 'Description',
        })
        expect(component.querySelector('label').textContent.trim()).to.equal('Description')
        expect(component.querySelector('textarea')).to.not.be.null
        expect(component.querySelector('textarea').id).to.equal('field-description')
      })

      it('should render label with text optional when given "optional" flag', () => {
        const component = macros.renderToDom('TextField', {
          optional: true,
          name: 'firstName',
          label: 'First name',
        })
        expect(component.querySelector('label').textContent.trim()).to.equal('First name (optional)')
      })

      it('should render label with text optional when given "optional" flag', () => {
        const component = macros.renderToDom('TextField', {
          optional: true,
          name: 'firstName',
          label: 'First name',
        })
        expect(component.querySelector('label').textContent.trim()).to.equal('First name (optional)')
      })

      it('should render label with hint when hint text is given', () => {
        const component = macros.renderToDom('TextField', {
          hint: 'Additional info',
          name: 'firstName',
          label: 'First name',
        })
        expect(component.querySelector('.c-form-group__hint').textContent.trim()).to.equal('Additional info')
      })
    })

    describe('field errors', () => {
      it('should render error message when error messages is given"', () => {
        const component = macros.renderToDom('TextField', {
          name: 'description',
          label: 'Description',
          error: 'Field has error',
        })
        expect(component.querySelector('.c-form-group__error-message').textContent.trim()).to.equal('Field has error')
      })
    })
  })

  describe('DateFieldset component', () => {
    describe('invalid props', () => {
      it('should not render without props', () => {
        const component = macros.renderToDom('DateFieldset')
        expect(component).to.be.null
      })
    })

    describe('valid props', () => {
      beforeEach(() => {
        this.component = macros.renderToDom('DateFieldset', {
          name: 'estimated_date',
          label: 'What is your favourite day?',
          hint: 'A day you really like',
          value: {
            month: '08',
            year: '1977',
          },
        })
      })

      it('should render a component with group id', () => {
        expect(this.component.id).to.equal('group-field-estimated_date')
      })

      it('should render a component with correct group class name and modifier', () => {
        expect(this.component.className.trim()).to.contain('c-form-group')
        expect(this.component.className.trim()).to.contain('c-form-group--inline')
      })

      it('should render a component with correct legend, labels and input fields', () => {
        const inputElems = this.component.querySelectorAll('input')
        const labelElems = this.component.querySelectorAll('label')

        expect(this.component.querySelector('legend').firstElementChild.textContent.trim()).to.equal('What is your favourite day?')
        expect(inputElems.length).to.equal(2)
        expect(labelElems.length).to.equal(2)
        expect(labelElems[0].textContent.trim()).to.equal('Month')
        expect(labelElems[1].textContent.trim()).to.equal('Year')
      })

      it('should render a component which has inputs with names and ids based on its name', () => {
        const inputElems = this.component.querySelectorAll('input')

        expect(inputElems[0].name).to.equal('estimated_date_month')
        expect(inputElems[1].name).to.equal('estimated_date_year')
        expect(inputElems[0].id).to.equal('field-estimated_date_month')
        expect(inputElems[1].id).to.equal('field-estimated_date_year')
      })

      it('should render a component with text input by default', () => {
        this.component.querySelectorAll('input').forEach((input) => {
          expect(input.type).to.equal('text')
        })
      })

      it('should render a field with value given', () => {
        const inputElems = this.component.querySelectorAll('input')

        expect(inputElems[0].value).to.equal('08')
        expect(inputElems[1].value).to.equal('1977')
      })
    })

    describe('field errors', () => {
      it('should render error message when error messages is given"', () => {
        const component = macros.renderToDom('DateFieldset', {
          name: 'estimated_date',
          label: 'What is your favourite day?',
          hint: 'A day you really like',
          value: {
            month: '08',
            year: '1977',
          },
          error: 'Please enter a valid date',
        })
        expect(component.querySelector('.c-form-group__error-message').textContent.trim()).to.equal('Please enter a valid date')
      })
    })
  })
})

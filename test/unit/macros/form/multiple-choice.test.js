const { getMacros } = require('~/test/unit/macro-helper')
const macros = getMacros('form')

describe('MultipleChoice component', () => {
  const minimumProps = {
    label: 'Multiple choice field',
    name: 'multiple-choice',
    fieldId: 'multiple-choice',
    type: 'radio',
    options: [
      {
        label: 'Foo',
        value: 'bar',
      },
      {
        label: 'Fizz',
        value: 'buzz',
      },
    ],
  }

  describe('invalid props', () => {
    context('no props', () => {
      it('should not render', () => {
        const component = macros.renderToDom('MultipleChoice')
        expect(component).to.be.null
      })
    })

    context('type not a checkbox or radio', () => {
      it('should not render', () => {
        const component = macros.renderToDom('MultipleChoice', {
          type: 'bar',
        })
        expect(component).to.be.null
      })
    })
  })

  describe('valid props', () => {
    beforeEach(() => {
      this.component = macros.renderToDom('MultipleChoice', minimumProps).parentElement
      this.options = this.component.querySelectorAll('.c-multiple-choice')
    })

    it('should render 2 items', () => {
      expect(this.options).to.have.lengthOf(2)
    })

    it('should render correct output for first option', () => {
      expect(this.options[0].querySelector('.c-multiple-choice__label-text').textContent).to.equal('Foo')
      expect(this.options[0].querySelector('.c-multiple-choice__input').getAttribute('value')).to.equal('bar')
    })

    it('should render correct output for second option', () => {
      expect(this.options[1].querySelector('.c-multiple-choice__label-text').textContent).to.equal('Fizz')
      expect(this.options[1].querySelector('.c-multiple-choice__input').getAttribute('value')).to.equal('buzz')
    })
  })

  describe('customise component', () => {
    context('value is passed', () => {
      beforeEach(() => {
        this.valueProps = Object.assign({}, minimumProps, {
          options: [
            {
              label: 'Boolean (True)',
              value: 'true',
            },
            {
              label: 'Boolean (False)',
              value: 'false',
            },
            {
              label: 'String',
              value: 'string',
            },
          ],
        })
      })

      context('value is a boolean', () => {
        it('should set option to selected if matches true', () => {
          const component = macros.renderToDom('MultipleChoice', Object.assign({}, this.valueProps, {
            value: true,
          })).parentElement
          const options = component.querySelectorAll('.c-multiple-choice__input')

          expect(options[0].getAttribute('checked')).to.equal('checked')
          expect(options[1].getAttribute('checked')).to.be.null
          expect(options[2].getAttribute('checked')).to.be.null
        })

        it('should set option to selected if matches false', () => {
          const component = macros.renderToDom('MultipleChoice', Object.assign({}, this.valueProps, {
            value: false,
          })).parentElement
          const options = component.querySelectorAll('.c-multiple-choice__input')

          expect(options[0].getAttribute('checked')).to.be.null
          expect(options[1].getAttribute('checked')).to.equal('checked')
          expect(options[2].getAttribute('checked')).to.be.null
        })

        it('should set option to selected if matches a string', () => {
          const component = macros.renderToDom('MultipleChoice', Object.assign({}, this.valueProps, {
            value: 'string',
          })).parentElement
          const options = component.querySelectorAll('.c-multiple-choice__input')

          expect(options[0].getAttribute('checked')).to.be.null
          expect(options[1].getAttribute('checked')).to.be.null
          expect(options[2].getAttribute('checked')).to.equal('checked')
        })
      })
    })
  })
})

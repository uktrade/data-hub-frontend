const { getMacros } = require('~/test/unit/macro-helper')
const macros = getMacros('form')

describe('DateFieldset component', () => {
  describe('invalid props', () => {
    it('should not render without props', () => {
      const component = macros.renderToDom('DateFieldset')
      expect(component).to.be.null
    })
  })

  describe('valid props', () => {
    describe('month and year', () => {
      beforeEach(() => {
        this.component = macros.renderToDom('DateFieldset', {
          name: 'estimated_date',
          label: 'What is your favourite day?',
          hint: 'A day you really like',
          value: {
            month: '04',
            year: '2017',
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

        expect(this.component.querySelector('legend').firstElementChild.textContent.trim())
          .to.equal('What is your favourite day?')
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

        expect(inputElems[0].value).to.equal('04')
        expect(inputElems[1].value).to.equal('2017')
      })
    })

    describe('month, year and day', () => {
      beforeEach(() => {
        this.component = macros.renderToDom('DateFieldset', {
          name: 'estimated_date',
          label: 'What is your favourite day?',
          hint: 'A day you really like',
          value: {
            month: '02',
            year: '2013',
            day: '19',
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

        expect(this.component.querySelector('legend').firstElementChild.textContent.trim())
          .to.equal('What is your favourite day?')
        expect(inputElems.length).to.equal(3)
        expect(labelElems.length).to.equal(3)
        expect(labelElems[0].textContent.trim()).to.equal('Month')
        expect(labelElems[1].textContent.trim()).to.equal('Year')
        expect(labelElems[2].textContent.trim()).to.equal('Day')
      })

      it('should render a component which has inputs with names and ids based on its name', () => {
        const inputElems = this.component.querySelectorAll('input')

        expect(inputElems[0].name).to.equal('estimated_date_month')
        expect(inputElems[1].name).to.equal('estimated_date_year')
        expect(inputElems[2].name).to.equal('estimated_date_day')
        expect(inputElems[0].id).to.equal('field-estimated_date_month')
        expect(inputElems[1].id).to.equal('field-estimated_date_year')
        expect(inputElems[2].id).to.equal('field-estimated_date_day')
      })

      it('should render a component with text input by default', () => {
        this.component.querySelectorAll('input').forEach((input) => {
          expect(input.type).to.equal('text')
        })
      })

      it('should render a field with value given', () => {
        const inputElems = this.component.querySelectorAll('input')

        expect(inputElems[0].value).to.equal('02')
        expect(inputElems[1].value).to.equal('2013')
        expect(inputElems[2].value).to.equal('19')
      })
    })

    describe('datetime ISO 8601 string', () => {
      it('should render three fields with values from ISO time stamp', () => {
        this.component = macros.renderToDom('DateFieldset', {
          name: 'date',
          label: 'Man in space',
          hint: '20th century',
          value: '2007-03-01T13:00:00',
        })

        const inputsValues = Array.from(this.component.querySelectorAll('input')).map(x => x.value)
        const labels = Array.from(this.component.querySelectorAll('label')).map(x => x.textContent.trim())

        expect(labels[0]).to.equal('Day')
        expect(inputsValues[0]).to.equal('01')
        expect(labels[1]).to.equal('Month')
        expect(inputsValues[1]).to.equal('03')
        expect(labels[2]).to.equal('Year')
        expect(inputsValues[2]).to.equal('2007')
      })
    })

    it('should render three fields with values from ISO time stamp', () => {
      this.component = macros.renderToDom('DateFieldset', {
        name: 'date',
        label: 'Man in space',
        hint: '20th century',
        value: '-03-',
      })

      const inputsValues = Array.from(this.component.querySelectorAll('input')).map(x => x.value)
      const labels = Array.from(this.component.querySelectorAll('label')).map(x => x.textContent.trim())

      expect(labels[0]).to.equal('Day')
      expect(inputsValues[0]).to.equal('')
      expect(labels[1]).to.equal('Month')
      expect(inputsValues[1]).to.equal('03')
      expect(labels[2]).to.equal('Year')
      expect(inputsValues[2]).to.equal('')
    })
  })

  describe('field errors', () => {
    it('should render error message when error messages is given"', () => {
      const component = macros.renderToDom('DateFieldset', {
        name: 'estimated_date',
        label: 'What is your favourite day?',
        hint: 'A day you really like',
        value: {
          month: '03',
          year: '2016',
        },
        error: 'Please enter a valid date',
      })
      expect(component.querySelector('.c-form-group__error-message').textContent.trim())
        .to.equal('Please enter a valid date')
    })
  })
})

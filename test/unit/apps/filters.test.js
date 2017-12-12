const moment = require('moment')

const { filterDisabledOption } = require('~/src/apps/filters')

const lastMonth = moment().subtract(1, 'months').toISOString()
const nextMonth = moment().add(1, 'months').toISOString()

describe('#filterDisabledOption', () => {
  context('when an option was disabled in the past', () => {
    beforeEach(() => {
      this.options = [{
        id: '1234',
        name: 'Freds',
        disabled_on: lastMonth,
      }]
    })

    context('when the option is not the current field value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption({
          currentValue: '3',
          createdOn: lastMonth,
        }))
      })

      it('should not include the option', () => {
        expect(this.filteredOptions).to.have.length(0)
      })
    })

    context('when the option is the current field value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption({
          currentValue: '1234',
          createdOn: lastMonth,
        }))
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })

    context('when there is no current value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption())
      })

      it('should not include the option', () => {
        expect(this.filteredOptions).to.have.length(0)
      })
    })
  })

  context('when an option is disabled in the future', () => {
    beforeEach(() => {
      this.options = [{
        id: '1234',
        name: 'Freds',
        disabled_on: nextMonth,
      }]
    })

    context('when the option is not the current field value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption({
          currentValue: '3',
          createdOn: lastMonth,
        }))
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })

    context('when the option is the current field value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption({
          currentValue: '1234',
          createdOn: lastMonth,
        }))
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })

    context('when there is no current value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption())
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })
  })

  context('when an option is not disabled', () => {
    beforeEach(() => {
      this.options = [{
        id: '1234',
        name: 'Freds',
        disabled_on: null,
      }]
    })

    context('when the option is not the current field value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption({
          currentValue: '3',
          createdOn: lastMonth,
        }))
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })

    context('when the option is the current field value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption({
          currentValue: '1234',
          createdOn: lastMonth,
        }))
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })

    context('when there is no current value', () => {
      beforeEach(() => {
        this.filteredOptions = this.options.filter(filterDisabledOption())
      })

      it('should include the option', () => {
        expect(this.filteredOptions).to.have.length(1)
      })
    })
  })
})

const config = require('~/config')
const { hydrateFiltersFields } = require('~/src/modules/form/builders/filters')

describe('Form filter builders', () => {
  describe('#hydrateFiltersFields', () => {
    beforeEach(async () => {
      nock(config.apiRoot)
        .get('/adviser/1234/')
        .reply(200, {
          name: 'Fred Smith',
          id: '1234',
        })
        .get('/adviser/4321/')
        .reply(200, {
          name: 'Wilma Brown',
          id: '4321',
        })

      const filtersFields = [
        {
          macroName: 'Typeahead',
          name: 'dit_adviser',
          entity: 'adviser',
        },
        {
          macroName: 'TextField',
          name: 'first_name',
        },
        {
          macroName: 'TextField',
          name: 'last_name',
        },
      ]
      const query = {
        dit_adviser: [ '1234', '4321' ],
        first_name: 'first',
      }

      this.hydratedFields = await hydrateFiltersFields('1234', filtersFields, query)
    })

    it('should set the value of the type ahead', () => {
      expect(this.hydratedFields[0].value).to.deep.equal([ '1234', '4321' ])
    })

    it('should set the selected options of the type ahead', () => {
      expect(this.hydratedFields[0].selectedOptions).to.deep.equal([
        { value: '1234', label: 'Fred Smith' },
        { value: '4321', label: 'Wilma Brown' },
      ])
    })

    it('should set the value of the first text field', () => {
      expect(this.hydratedFields[1].value).to.deep.equal([ 'first' ])
    })

    it('should not set the selected options of the first text field', () => {
      expect(this.hydratedFields[1].selectedOptions).to.not.exist
    })

    it('should not set the value of the second text field', () => {
      expect(this.hydratedFields[2].value).to.not.exist
    })

    it('should not set the selected options of the second text field', () => {
      expect(this.hydratedFields[2].selectedOptions).to.not.exist
    })
  })
})

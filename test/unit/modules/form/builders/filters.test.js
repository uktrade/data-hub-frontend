const config = require('~/config')
const {
  buildSelectedFiltersSummary,
  hydrateFiltersFields,
  getHighlightTerm,
} = require('~/src/modules/form/builders/filters')

describe('Form filter builders', () => {
  describe('#buildSelectedFiltersSummary', () => {
    beforeEach(() => {
      const hydratedFiltersFields = [
        {
          macroName: 'Typeahead',
          name: 'dit_adviser',
          entity: 'adviser',
          label: 'Adviser',
          value: [
            '1234',
            '4321',
          ],
          selectedOptions: [
            { value: '1234', label: 'Fred Smith' },
            { value: '4321', label: 'Wilma Brown' },
          ],
        },
        {
          macroName: 'TextField',
          name: 'first_name',
          label: 'First name',
          value: 'first',
        },
        {
          macroName: 'TextField',
          name: 'last_name',
        },
        {
          macroName: 'TextField',
          name: 'no_summary',
          value: 'no',
          summarise: false,
        },
      ]

      const query = {
        dit_adviser: [
          '1234',
          '4321',
        ],
        first_name: 'first',
        no_summary: 'no',
      }

      this.selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, query, '/base')
    })

    it('should set the Adviser label', () => {
      expect(this.selectedFiltersSummary[0].label).to.equal('Adviser')
    })

    it('should set the Adviser filters', () => {
      expect(this.selectedFiltersSummary[0].filters).to.deep.equal([
        {
          label: 'Fred Smith',
          removeHref: '/base?dit_adviser=4321&first_name=first&no_summary=no',
          value: '1234',
        },
        {
          label: 'Wilma Brown',
          removeHref: '/base?dit_adviser=1234&first_name=first&no_summary=no',
          value: '4321',
        },
      ])
    })

    it('should set the First name label', () => {
      expect(this.selectedFiltersSummary[1].label).to.equal('First name')
    })

    it('should set the First name filters', () => {
      expect(this.selectedFiltersSummary[1].filters).to.deep.equal([
        {
          label: 'first',
          removeHref: '/base?dit_adviser=1234&dit_adviser=4321&no_summary=no',
          value: 'first',
        },
      ])
    })

    it('should not set the no summary filter', () => {
      expect(this.selectedFiltersSummary[2]).to.not.exist
    })
  })

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
      expect(this.hydratedFields[1].value).to.equal('first')
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

  describe('#getHighlightTerm', () => {
    context('when filtering by the name field', () => {
      beforeEach(() => {
        const selectedFiltersSummary = [
          {
            name: 'some_other_filter',
            label: 'Some other filter',
            filters: [
              {
                label: 'Filter 1',
              },
            ],
          },
          {
            name: 'name',
            label: 'Company name',
            filters: [
              {
                label: 'One List Corp',
              },
            ],
          },
        ]

        this.highlightTerm = getHighlightTerm(selectedFiltersSummary, 'name')
      })

      it('should return the highlight term', () => {
        expect(this.highlightTerm).to.equal('One List Corp')
      })
    })

    context('when not filtering by the name field', () => {
      beforeEach(() => {
        this.highlightTerm = getHighlightTerm([], 'name')
      })

      it('should not return the highlight term', () => {
        expect(this.highlightTerm).to.not.exist
      })
    })
  })
})

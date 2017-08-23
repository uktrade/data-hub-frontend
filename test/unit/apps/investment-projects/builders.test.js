describe('Investment projects builders', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()

    this.controller = proxyquire('~/src/apps/investment-projects/builders', {
      './macros': {
        investmentFiltersFields: [
          {
            macroName: 'MultipleChoiceField',
            name: 'stage',
            label: 'State',
            type: 'checkbox',
            options: this.sandbox.stub().returns([
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
              { value: 'c', label: 'C' },
            ]),
          },
          {
            macroName: 'MultipleChoiceField',
            name: 'sector',
            label: 'Sector',
            options: [
              { value: 'x', label: 'X' },
              { value: 'y', label: 'Y' },
              { value: 'z', label: 'Z' },
            ],
          },
          {
            macroName: 'TextField',
            label: 'Estimated land date after',
            name: 'estimated_land_date_after',
            hint: 'YYYY-MM-DD',
            placeholder: 'e.g. 2018-07-18',
          },
        ],
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#buildSelectedInvestmentFiltersSummary', () => {
    it('should return empty object when called without query', () => {
      const actual = this.controller.buildSelectedInvestmentFiltersSummary()

      expect(actual).to.be.an('object').and.be.empty
    })

    it('should return object with filters containing valueLabels for values defined in query', () => {
      const query = {
        stage: 'a',
        sector: 'x',
      }

      const actual = this.controller.buildSelectedInvestmentFiltersSummary(query)

      expect(actual.stage.label).to.equal('State')
      expect(actual.stage.valueLabel).to.equal('A')
      expect(actual.sector.label).to.equal('Sector')
      expect(actual.sector.valueLabel).to.equal('X')
    })

    it('should return filters object with value as valueLabel for text field', () => {
      const query = {
        estimated_land_date_after: '2017-08-03',
      }

      const actual = this.controller.buildSelectedInvestmentFiltersSummary(query)

      expect(actual.estimated_land_date_after).to.have.property('label').a('string')
      expect(actual.estimated_land_date_after.valueLabel).to.equal('2017-08-03')
    })

    it('should return filters object with valueLabel for multiple values (string)', () => {
      const query = {
        stage: 'a,c',
      }

      const actual = this.controller.buildSelectedInvestmentFiltersSummary(query)

      expect(actual.stage.valueLabel).to.equals('A, C')
    })

    it('should return filters object with valueLabel for multiple values (array)', () => {
      const query = {
        stage: ['b', 'c'],
      }

      const actual = this.controller.buildSelectedInvestmentFiltersSummary(query)

      expect(actual.stage.valueLabel).to.equals('B, C')
    })
  })
})

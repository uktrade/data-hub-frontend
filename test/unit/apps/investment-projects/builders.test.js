describe('Investment projects builders', () => {
  beforeEach(async () => {
    this.controller = proxyquire('~/src/apps/investment-projects/builders', {
      '../../lib/metadata': {
        investmentStageOptions: [
          { id: 'i1', name: 'Investment stage #1' },
          { id: 'i2', name: 'Investment stage #2' },
        ],
        investmentTypeOptions: [
          { id: 't1', name: 'Investment type #1' },
          { id: 't2', name: 'Investment type #2' },
        ],
        sectorOptions: [
          { id: 's1', name: 'Sector #1' },
          { id: 's2', name: 'Sector #2' },
        ],
      },
      './form-fields': {
        filterFields: [
          {
            MultipleChoiceField: {
              type: 'checkbox',
              name: 'stage',
              modifier: 'smaller',
            },
          }, {
            MultipleChoiceField: {
              type: 'radio',
              name: 'investment_type',
            },
          },
        ],
      },
    })
  })

  describe('#buildInvestmentFilters', () => {
    it('should return object with all filters when called without query', () => {
      const actual = this.controller.buildInvestmentFilters()

      expect(actual).to.have.property('stage').an('object')
      expect(actual).to.have.property('sector').an('object')
      expect(actual).to.have.property('investment_type').an('object')
      expect(actual).to.have.property('estimated_land_date_before').an('object')
      expect(actual).to.have.property('estimated_land_date_after').an('object')
    })

    it('should return filters containing valueLabels for values set in query object', () => {
      const query = {
        stage: 'i1',
        sector: 's1',
      }

      const actual = this.controller.buildInvestmentFilters(query)

      expect(actual.stage.options).to.have.length(2)
      expect(actual.stage.value).to.equal('i1')
      expect(actual.stage.label).to.equal('Stage')
      expect(actual.stage.valueLabel).to.equal('Investment stage #1')

      expect(actual.sector.options).to.have.length(2)
      expect(actual.sector.value).to.equal('s1')
      expect(actual.sector.label).to.equal('Sector')
      expect(actual.sector.valueLabel).to.equal('Sector #1')
    })

    it('should return filters object with filter names, values and value labels for options', () => {
      const query = {
        stage: 'i1',
        sector: 's1',
      }

      const actual = this.controller.buildInvestmentFilters(query)

      expect(actual.stage.options).to.have.length(2)
      expect(actual.stage.value).to.equal('i1')
      expect(actual.stage.label).to.equal('Stage')
      expect(actual.stage.valueLabel).to.equal('Investment stage #1')

      expect(actual.sector.options).to.have.length(2)
      expect(actual.sector.value).to.equal('s1')
      expect(actual.sector.label).to.equal('Sector')
      expect(actual.sector.valueLabel).to.equal('Sector #1')
    })

    it('should return filters object with value as valueLabel for text field', () => {
      const query = {
        estimated_land_date_after: '2017-08-03',
      }

      const actual = this.controller.buildInvestmentFilters(query)

      expect(actual.estimated_land_date_after).to.have.property('label').a('string')
      expect(actual.estimated_land_date_after.valueLabel).to.equal('2017-08-03')
    })

    it('should return filters object with valueLabel for multiple values (string)', () => {
      const query = {
        stage: 'i1,i2',
      }

      const actual = this.controller.buildInvestmentFilters(query)

      expect(actual.stage.valueLabel).to.equals('Investment stage #1, Investment stage #2')
    })

    it('should return filters object with valueLabel for multiple values (array)', () => {
      const query = {
        stage: ['i1', 'i2'],
      }

      const actual = this.controller.buildInvestmentFilters(query)

      expect(actual.stage.valueLabel).to.equals('Investment stage #1, Investment stage #2')
    })
  })
})

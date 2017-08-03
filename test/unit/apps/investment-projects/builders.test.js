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
    })
  })

  describe('#buildInvestmentFilters', () => {
    it('should return object with all filters when called without query', () => {
      const actual = this.controller.buildInvestmentFilters()

      expect(actual).to.have.property('stage').an('object')
      expect(actual).to.have.property('sector').an('object')
      expect(actual).to.have.property('investment_type').an('object')
      expect(actual).to.have.property('total_investment').an('object')
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
  })

  describe('#buildInvestmentSorting', () => {
    it('should return an object containing selected sort mode and sort options', () => {
      const actual = this.controller.buildInvestmentSorting()

      expect(actual).to.have.property('selected', actual.options[0].value)
      expect(actual).to.have.property('options').an('array').with.length.above(1)
    })

    it('should return an object containing selected sort mode and sort options', () => {
      const actual = this.controller.buildInvestmentSorting({ sortby: 'stage.name' })

      expect(actual.selected).to.equal('stage.name')
    })
  })
})

const {
  transformMetadataIntoOption,
  transformInvestmentProjectIntoListItem,
} = require('~/src/apps/investment-projects/transformers')

const investmentProjectsData = require('~/test/unit/data/investment/collection')

describe('Investment project data transformers', () => {
  describe('#transformMetadataIntoOption', () => {
    it('should transform metadata items into option items', () => {
      const mock = [
        { id: '12345', name: 'Purple' },
        { id: '67890', name: 'Rain' },
      ]

      const expected = [
        { value: '12345', label: 'Purple' },
        { value: '67890', label: 'Rain' },
      ]

      const actual = mock.map(transformMetadataIntoOption)

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('#transformInvestmentProjectIntoListItem', () => {
    it('should transform investment project items into investment project entity list items', () => {
      const actual = investmentProjectsData.results.map(transformInvestmentProjectIntoListItem)
      const firstItem = actual[0]

      expect(actual).to.have.length(3)
      expect(firstItem.id).to.a('string')
      expect(firstItem.name).to.a('string')
      expect(firstItem.type).to.a('string')
      expect(firstItem.code).to.a('string')
      expect(firstItem.meta).to.an('array').that.have.length(5)

      expect(firstItem.meta[0].name).to.equal('stage')
      expect(firstItem.meta[0].label).to.be.a('string')
      expect(firstItem.meta[0].value).to.be.an('object')
      expect(firstItem.meta[0].isTag).to.be.true

      expect(firstItem.meta[1].name).to.equal('investment_type')
      expect(firstItem.meta[1].label).to.be.a('string')
      expect(firstItem.meta[1].value).to.be.an('object')
      expect(firstItem.meta[1].tagModifier).to.equal('alt')

      expect(firstItem.meta[3].name).to.equal('estimated_land_date')
      expect(firstItem.meta[3].isInert).to.be.true
      expect(firstItem.meta[3].isTag).to.be.false
    })
  })
})

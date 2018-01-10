const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
} = require('~/src/apps/investment-projects/transformers')

const investmentProjectsData = require('~/test/unit/data/investment/collection')

describe('Investment project data transformers', () => {
  describe('#transformInvestmentProjectIntoListItem', () => {
    it('should transform investment project items into investment project entity list items', () => {
      const actual = investmentProjectsData.results.map(transformInvestmentProjectToListItem)
      const firstItem = actual[0]

      expect(actual).to.have.length(3)
      expect(firstItem.id).to.a('string')
      expect(firstItem.name).to.a('string')
      expect(firstItem.type).to.a('string')
      expect(firstItem.code).to.a('string')
      expect(firstItem.meta).to.an('array').that.have.length(5)

      expect(firstItem.meta[0].label).to.be.a('string')
      expect(firstItem.meta[0].type).to.be.a('string')
      expect(firstItem.meta[0].value).to.be.an('object')

      expect(firstItem.meta[1].label).to.be.a('string')
      expect(firstItem.meta[1].value).to.be.an('object')
      expect(firstItem.meta[1].badgeModifier).to.equal('secondary')

      expect(firstItem.meta[3].isInert).to.be.true
      expect(firstItem.meta[3].type).to.equal('dateMonthYear')
    })
  })

  describe('#transformInvestmentListItemToDisableMetaLinks', () => {
    it('should mark any metaItem as inert', () => {
      const item = {
        id: '1234',
        meta: [{
          name: 'item',
        }],
      }

      const transformedItem = transformInvestmentListItemToDisableMetaLinks(item)
      expect(transformedItem.meta[0].isInert).to.equal(true)
    })
  })
})

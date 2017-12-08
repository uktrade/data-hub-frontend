const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
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

  describe('#transformInvestmentListItemToHaveMetaLinks', () => {
    beforeEach(() => {
      this.mockInvestmentListItemData = [
        {
          id: '12345',
          type: 'investment-project',
          code: 'AB-0001',
          meta: [
            {
              name: 'stage',
              label: 'Stage',
              value: 's1',
              isBadge: true,
            },
            {
              name: 'investment_type',
              label: 'Investment type',
              value: 'i1',
              badgeModifier: 'secondary',
              isBadge: true,
            },
          ],
        },
      ]
    })

    it('should add URL property to meta items', () => {
      const actual = this.mockInvestmentListItemData.map(transformInvestmentListItemToHaveMetaLinks())

      const result = actual[0]
      expect(result.meta[0].name).to.equal('stage')
      expect(result.meta[0].value).to.equal('s1')
      expect(result.meta[0].url).to.equal('?custom=true&stage=s1')
      expect(result.meta[0].isSelected).to.be.false

      expect(result.meta[1].name).to.equal('investment_type')
      expect(result.meta[1].value).to.equal('i1')
      expect(result.meta[1].url).to.equal('?custom=true&investment_type=i1')
      expect(result.meta[1].isSelected).to.be.false
    })

    it('should set isSelected to true when query contains a key/value pair matching a meta item', () => {
      const mockQuery = {
        stage: 's1',
      }
      const actual = this.mockInvestmentListItemData.map(transformInvestmentListItemToHaveMetaLinks(mockQuery))

      const result = actual[0]
      expect(result.meta[0].name).to.equal('stage')
      expect(result.meta[0].value).to.equal('s1')
      expect(result.meta[0].url).to.equal('?custom=true&stage=s1')
      expect(result.meta[0].isSelected).to.be.true

      expect(result.meta[1].isSelected).to.be.false
    })

    it('should not add URL or set isSelected to true when meta item is set to inert', () => {
      const mockQuery = {
        stage: 's1',
      }
      this.mockInvestmentListItemData[0].meta[0].isInert = true
      const actual = this.mockInvestmentListItemData.map(transformInvestmentListItemToHaveMetaLinks(mockQuery))

      const result = actual[0]

      expect(result.meta[0].name).to.equal('stage')
      expect(result.meta[0].isInert).to.be.true
      expect(result.meta[0].url).to.not.exist
      expect(result.meta[0].isSelected).to.not.exist
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

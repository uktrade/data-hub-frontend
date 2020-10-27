const investmentProjectsData = require('../../../../../test/unit/data/investment/collection.json')
const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
} = require('../collection')

describe('Investment project transformers', () => {
  describe('#transformInvestmentProjectToListItem', () => {
    context('when transforming a fully populated project', () => {
      beforeEach(() => {
        this.rawItem = investmentProjectsData.results[0]
        const transformed = investmentProjectsData.results.map(
          transformInvestmentProjectToListItem
        )
        this.transformedItem = transformed[0]
      })

      it('should provide the name', () => {
        expect(this.transformedItem.headingText).to.equal(this.rawItem.name)
      })

      it('should provide the type', () => {
        expect(this.transformedItem.type).to.equal('project')
      })

      it('should list the esimated land date as date', () => {
        expect(this.transformedItem.metadata[2]).to.deep.equal({
          label: 'Estimated land date',
          value: 'November 2020',
        })
      })
      it('should list the project code', () => {
        expect(this.transformedItem.subheading).to.equal(
          'Project code DHP-00000110'
        )
      })
    })
  })

  describe('#transformInvestmentListItemToDisableMetaLinks', () => {
    it('should mark any metaItem as inert', () => {
      const item = {
        id: '1234',
        meta: [
          {
            name: 'item',
          },
        ],
      }

      const transformedItem = transformInvestmentListItemToDisableMetaLinks(
        item
      )
      expect(transformedItem.meta[0].isInert).to.equal(true)
    })
  })
})

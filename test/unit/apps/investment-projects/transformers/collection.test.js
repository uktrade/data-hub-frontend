const investmentProjectsData = require('~/test/unit/data/investment/collection')
const investmentLargeProfilesCollection = require('~/test/unit/data/investment/investement-large-profiles-collection')

const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
  transformInvestmentProjectLargeProfilesToListItem,
} = require('~/src/apps/investments/transformers/collection')

describe('Investment project transformers', () => {
  describe('#transformInvestmentProjectToListItem', () => {
    context('when transforming a fully populated project', () => {
      beforeEach(() => {
        this.rawItem = investmentProjectsData.results[0]
        const transformed = investmentProjectsData.results.map(transformInvestmentProjectToListItem)
        this.transformedItem = transformed[0]
      })

      it('should provide the id', () => {
        expect(this.transformedItem.id).to.equal(this.rawItem.id)
      })

      it('should provide the name', () => {
        expect(this.transformedItem.name).to.equal(this.rawItem.name)
      })

      it('should provide the type', () => {
        expect(this.transformedItem.type).to.equal('investments/project')
      })

      it('should list the stage as a badge', () => {
        expect(this.transformedItem.meta[0]).to.deep.equal({
          label: 'Stage',
          type: 'badge',
          value: this.rawItem.stage,
        })
      })

      it('should list the invstment type as a badge', () => {
        expect(this.transformedItem.meta[1]).to.deep.equal({
          label: 'Investment type',
          type: 'badge',
          badgeModifier: 'secondary',
          value: this.rawItem.investment_type,
        })
      })

      it('should list the investor company', () => {
        expect(this.transformedItem.meta[2]).to.deep.equal({
          label: 'Investor',
          value: this.rawItem.investor_company,
        })
      })

      it('should list the sector', () => {
        expect(this.transformedItem.meta[3]).to.deep.equal({
          label: 'Sector',
          value: this.rawItem.sector,
        })
      })

      it('should list the esimated land date as date', () => {
        expect(this.transformedItem.meta[4]).to.deep.equal({
          label: 'Estimated land date',
          type: 'dateMonthYear',
          value: this.rawItem.estimated_land_date,
          isInert: true,
        })
      })

      it('should list the project code', () => {
        expect(this.transformedItem.subTitle).to.deep.equal({
          label: 'Project code',
          value: this.rawItem.project_code,
        })
      })
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

  describe('#transformInvestmentProjectLargeProfilesToListItem', () => {
    context('when transforming a fully populated project', () => {
      beforeEach(() => {
        this.rawItem = investmentLargeProfilesCollection.results[0]
        this.transformed = investmentLargeProfilesCollection.results.map(transformInvestmentProjectLargeProfilesToListItem)
        this.transformedItem = this.transformed[0]
      })

      it('should provide the id', () => {
        expect(this.transformedItem.id).to.equal(this.rawItem.id)
      })

      it('should provide the investor company name', () => {
        expect(this.transformed[0].name).to.equal(this.rawItem.investor_company.name)
      })

      it('should provide the url to company profile', () => {
        expect(this.transformed[0].url).to.equal(
          `/companies/${this.rawItem.investor_company.id}/investments/large-capital-profile`)
      })

      it('should list the updated date', () => {
        expect(this.transformedItem.meta[0]).to.deep.equal({
          label: 'Updated on',
          type: 'date',
          value: this.rawItem.modified_on,
        })
      })

      it('should list the country as badge', () => {
        expect(this.transformedItem.meta[1]).to.deep.equal({
          label: 'Country of origin',
          type: 'badge',
          badgeModifier: 'secondary',
          value: this.rawItem.country_of_origin,
        })
      })

      it('should list the investor type', () => {
        expect(this.transformedItem.meta[2]).to.deep.equal({
          label: 'Investor type',
          value: this.rawItem.investor_type,
        })
      })

      it('should list the global assets under management', () => {
        expect(this.transformedItem.meta[3]).to.deep.equal({
          label: 'Global assets under management',
          value: this.rawItem.global_assets_under_management,
        })
      })
    })
  })
})

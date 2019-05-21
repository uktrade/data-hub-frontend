const {
  transformInvestorRequirements,
} = require('~/src/apps/companies/apps/investments/large-capital-profile/transformers')

describe('Large capital profile, Investor requirements form to API', () => {
  context('when translating Investor requirements', () => {
    it('should transform undefined into an empty array', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: undefined,
        investmentTypes: undefined,
        timeHorizons: undefined,
        restrictions: undefined,
        constructionRisks: undefined,
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: [],
        investment_types: [],
        time_horizons: [],
        restrictions: [],
        construction_risks: [],
      })
    })

    it('should transform a String by adding it to an empty array', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: 'id',
        investmentTypes: 'id',
        timeHorizons: 'id',
        restrictions: 'id',
        constructionRisks: 'id',
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: ['id'],
        investment_types: ['id'],
        time_horizons: ['id'],
        restrictions: ['id'],
        construction_risks: ['id'],
      })
    })

    it('should not transform String arrays', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: ['id'],
        investmentTypes: ['id'],
        timeHorizons: ['id'],
        restrictions: ['id'],
        constructionRisks: ['id'],
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: ['id'],
        investment_types: ['id'],
        time_horizons: ['id'],
        restrictions: ['id'],
        construction_risks: ['id'],
      })
    })
  })
})

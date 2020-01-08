const { transformInvestorRequirements } = require('../index')

describe('Large capital profile, Investor requirements form to API', () => {
  context('when translating Investor requirements', () => {
    it('should transform all undefined fields', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: undefined,
        energyAndInfrastructure: undefined,
        investmentTypes: undefined,
        minimumReturnRate: undefined,
        timeHorizons: undefined,
        restrictions: undefined,
        constructionRisks: undefined,
        desiredDealsRoles: undefined,
        minimumEquityPercentage: undefined,
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: [],
        asset_classes_of_interest: [],
        investment_types: [],
        minimum_return_rate: undefined,
        time_horizons: [],
        restrictions: [],
        construction_risks: [],
        desired_deal_roles: [],
        minimum_equity_percentage: undefined,
      })
    })

    it('should transform all String fields', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: 'id',
        energyAndInfrastructure: 'id',
        investmentTypes: 'id',
        minimumReturnRate: 'id',
        timeHorizons: 'id',
        restrictions: 'id',
        constructionRisks: 'id',
        minimumEquityPercentage: 'id',
        desiredDealRoles: 'id',
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: ['id'],
        asset_classes_of_interest: ['id'],
        investment_types: ['id'],
        minimum_return_rate: 'id',
        time_horizons: ['id'],
        restrictions: ['id'],
        construction_risks: ['id'],
        minimum_equity_percentage: 'id',
        desired_deal_roles: ['id'],
      })
    })

    it('should not transform String arrays', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: ['id'],
        energyAndInfrastructure: ['id'],
        investmentTypes: ['id'],
        minimumReturnRate: 'id',
        timeHorizons: ['id'],
        restrictions: ['id'],
        constructionRisks: ['id'],
        minimumEquityPercentage: 'id',
        desiredDealRoles: ['id'],
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: ['id'],
        asset_classes_of_interest: ['id'],
        investment_types: ['id'],
        minimum_return_rate: 'id',
        time_horizons: ['id'],
        restrictions: ['id'],
        construction_risks: ['id'],
        minimum_equity_percentage: 'id',
        desired_deal_roles: ['id'],
      })
    })
  })
})

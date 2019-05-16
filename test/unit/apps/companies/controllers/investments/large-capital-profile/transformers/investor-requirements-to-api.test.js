const {
  transformInvestorRequirements,
} = require('~/src/apps/companies/apps/investments/large-capital-profile/transformers')

describe('Large capital profile, Investor requirements form to API', () => {
  context('when translating Investor requirements', () => {
    it('should transform undefined into an empty array', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: undefined,
        investmentTypes: undefined,
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: [],
        investment_types: [],
      })
    })

    it('should transform a String by adding it to an empty array', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: '123',
        investmentTypes: '456',
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: ['123'],
        investment_types: ['456'],
      })
    })

    it('should not transform String arrays', () => {
      this.transformed = transformInvestorRequirements({
        dealTicketSizes: ['1', '2', '3'],
        investmentTypes: ['4', '5', '6'],
      })
      expect(this.transformed).to.deep.equal({
        deal_ticket_sizes: ['1', '2', '3'],
        investment_types: ['4', '5', '6'],
      })
    })
  })
})

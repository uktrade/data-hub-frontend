const { grossValueAddedMessage, gvaMessages } = require('../gross-value-added-message')
const { investmentTypes } = require('../../../types')

describe('Gross value added message', () => {
  context('when the investment type is not Foreign direct investment (FDI)', () => {
    it('should be null when the investment type is Commitment to invest (CTI)', () => {
      const investment = {
        investment_type: {
          name: investmentTypes.CTI,
        },
      }
      expect(grossValueAddedMessage(investment)).to.be.null
    })
    it('should be null when the investment type is Non-FDI', () => {
      const investment = {
        investment_type: {
          name: investmentTypes.NON_FDI,
        },
      }
      expect(grossValueAddedMessage(investment)).to.be.null
    })
  })

  context('when GVA is defined', () => {
    it('should be null when the investment type is FDI', () => {
      const investment = {
        investment_type: { name: investmentTypes.FDI },
        gross_value_added: 123,
      }
      expect(grossValueAddedMessage(investment)).to.be.null
    })
  })

  context('when GVA is null and the user has not provided Foreign equity investment', () => {
    it('should provide a message to the user', () => {
      const investment = {
        sector: {},
        foreign_equity_investment: null,
        investment_type: { name: investmentTypes.FDI },
        gross_value_added: null,
      }
      expect(grossValueAddedMessage(investment)).to.eq(gvaMessages.capitalExpenditureRequired)
    })
  })

  context('when GVA is null and the user has not provided a Sector', () => {
    it('should provide a message to the user', () => {
      const investment = {
        sector: null,
        foreign_equity_investment: 250000,
        investment_type: { name: investmentTypes.FDI },
        gross_value_added: null,
      }

      expect(grossValueAddedMessage(investment)).to.eq(gvaMessages.primarySector)
    })
  })

  context('when GVA is null and the user has not provided both Foreign equity investment and a Sector ', () => {
    it('should provide a message to the user', () => {
      const investment = {
        sector: null,
        foreign_equity_investment: null,
        investment_type: { name: investmentTypes.FDI },
        gross_value_added: null,
      }
      expect(grossValueAddedMessage(investment)).to.eq(gvaMessages.capitalExpenditureAndPrimarySectorRequired)
    })
  })
})

const { investmentTypes, fdiTypes } = require('../types')
const { getInvestmentTypeDetails } = require('../transformers/shared')

describe('Investment type details', () => {
  it('should return just the investment type: Non-FDI', () => {
    expect(getInvestmentTypeDetails(
      { name: investmentTypes.NON_FDI },
      { name: fdiTypes.MERGER })
    ).to.equal(investmentTypes.NON_FDI)
  })
  it('should return just the investment type: Commitment to invest', () => {
    expect(getInvestmentTypeDetails(
      { name: investmentTypes.CTI },
      { name: fdiTypes.MERGER })
    ).to.equal(investmentTypes.CTI)
  })
  it('should return both the investment type and the FDI type: FDI, merger', () => {
    expect(getInvestmentTypeDetails(
      { name: investmentTypes.FDI },
      { name: fdiTypes.MERGER })
    ).to.equal(`${investmentTypes.FDI}, ${fdiTypes.MERGER}`)
  })
})

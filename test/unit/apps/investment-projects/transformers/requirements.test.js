const investmentData = require('~/test/unit/data/investment/investment-data.json')
const { transformInvestmentRequirementsForView } = require('~/src/apps/investment-projects/transformers/requirements')

describe('Investment project transformers', () => {
  describe('#transformInvestmentRequirementsForView', () => {
    context('when no uk company is provided', () => {
      beforeEach(() => {
        this.investmentData = Object.assign({}, investmentData, {
          id: 1,
          uk_company: null,
        })

        this.transformedInvestmentRequirements = transformInvestmentRequirementsForView(this.investmentData)
      })

      it('should set the investment details to display a link to find a company', () => {
        expect(this.transformedInvestmentRequirements.uk_company).to.deep.equal({
          name: 'Find company',
          url: `/investment-projects/1/edit-ukcompany`,
        })
      })
    })

    context('when a uk company has previously been set', () => {
      beforeEach(() => {
        this.investmentData = Object.assign({}, investmentData, {
          id: 1,
          uk_company: {
            id: '1234',
            name: 'Freds',
          },
        })

        this.transformedInvestmentRequirements = transformInvestmentRequirementsForView(this.investmentData)
      })

      it('should set the investment details to display the company name', () => {
        expect(this.transformedInvestmentRequirements.uk_company.name).to.equal('Freds')
      })

      it('should set the investment details to display an action to edit the company money is going through', () => {
        expect(this.transformedInvestmentRequirements.uk_company.actions[0]).to.deep.equal({
          label: 'Edit company',
          url: `/investment-projects/1/edit-ukcompany?term=Freds`,
        })
      })

      it('should set the investment details to display an action to remove the company the money is going through', () => {
        expect(this.transformedInvestmentRequirements.uk_company.actions[1]).to.deep.equal({
          label: 'Remove company',
          url: `/investment-projects/1/remove-ukcompany`,
        })
      })
    })
  })
})

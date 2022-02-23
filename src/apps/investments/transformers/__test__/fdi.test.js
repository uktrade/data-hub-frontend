const { transformInvestmentFDIForView } = require('../fdi')

const investment = {
  investment_type: {
    id: '3e143372-496c-4d1e-8278-6fdd3da9b48b',
    name: 'FDI',
  },
  fdi_type: {
    name: 'Creation of new site or activity',
    id: 'f8447013-cfdc-4f35-a146-6619665388b3',
  },
  investor_company: {
    id: 'fc58888b-a098-e211-a939-e4115bead28a',
    name: 'Investor company',
    address: {
      country: {
        name: 'France',
      },
    },
  },
}

describe('Investment FDI transformer', () => {
  describe('#transformInvestmentFDIForView', () => {
    const commonTests = ({ expectedInvestorRetainingVotingPower }) => {
      it('should contain only the expected fields', () => {
        expect(this.transformed).to.have.ordered.keys([
          'foreign_country',
          'foreign_investor',
          'investor_retain_voting_power',
          'type_of_investment',
          'uk_company',
        ])
      })

      it('should set the foreign country', () => {
        expect(this.transformed.foreign_country).to.equal('France')
      })

      it('should set the foreign investor', () => {
        expect(this.transformed.foreign_investor).to.deep.equal({
          name: 'Investor company',
          url: '/companies/fc58888b-a098-e211-a939-e4115bead28a',
        })
      })

      it('should set investor retaining voting power', () => {
        expect(this.transformed.investor_retain_voting_power).to.equal(
          expectedInvestorRetainingVotingPower
        )
      })

      it('should set Investment type', () => {
        expect(this.transformed.type_of_investment).to.equal(
          'FDI, Creation of new site or activity'
        )
      })
    }

    context('when the investment has a UK company', () => {
      beforeEach(() => {
        this.transformed = transformInvestmentFDIForView({
          ...investment,
          uk_company: {
            id: '24f8df2c-a22e-4058-bda9-b5b96853ccd7',
            name: 'UK company',
          },
        })
      })

      commonTests({ expectedInvestorRetainingVotingPower: 'Yes' })

      it('should set the UK company', () => {
        expect(this.transformed.uk_company).to.deep.equal({
          name: 'UK company',
          url: '/companies/24f8df2c-a22e-4058-bda9-b5b96853ccd7',
        })
      })
    })

    context('when the investment UK company is not known', () => {
      beforeEach(() => {
        this.transformed = transformInvestmentFDIForView(investment)
      })

      commonTests({ expectedInvestorRetainingVotingPower: 'No' })

      it('should not set the UK company', () => {
        expect(this.transformed.uk_company).to.not.exist
      })
    })
  })
})

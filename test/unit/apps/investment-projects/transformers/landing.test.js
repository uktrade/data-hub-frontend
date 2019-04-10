const { transformInvestmentLandingForView } = require('~/src/apps/investments/transformers/landing')

describe('Investment landing transformer', () => {
  describe('#transformInvestmentLandingForView', () => {
    context('when the investment has a UK company and actual land date', () => {
      beforeEach(() => {
        this.transformed = transformInvestmentLandingForView({
          uk_company: {
            id: '24f8df2c-a22e-4058-bda9-b5b96853ccd7',
            name: 'UK company',
            company_number: '123456',
            address: {
              line_1: 'line 1',
              line_2: 'line 2',
              town: 'town',
              county: 'county',
              postcode: 'postcode',
              country: {
                name: 'country',
              },
            },
          },
          actual_land_date: '2019-04-09',
        })
      })

      it('should set the UK company', () => {
        expect(this.transformed.uk_company).to.deep.equal({
          name: 'UK company',
          url: `/companies/24f8df2c-a22e-4058-bda9-b5b96853ccd7`,
        })
      })

      it('should set the company number', () => {
        expect(this.transformed.company_number).to.equal('123456')
      })

      it('should set the address', () => {
        expect(this.transformed.registered_address).to.deep.equal([
          'line 1',
          'line 2',
          'town',
          'county',
          'postcode',
          'country',
        ])
      })

      it('should set the actual land date', () => {
        expect(this.transformed.actual_land_date).to.equal('9 April 2019')
      })
    })

    context('when the investment UK company and actual land date are not known', () => {
      beforeEach(() => {
        this.transformed = transformInvestmentLandingForView({})
      })

      it('should not set the UK company', () => {
        expect(this.transformed.uk_company).to.not.exist
      })

      it('should not set the company number', () => {
        expect(this.transformed.company_number).to.not.exist
      })

      it('should not set the address', () => {
        expect(this.transformed.registered_address).to.not.exist
      })

      it('should not set the actual land date', () => {
        expect(this.transformed.actual_land_date).to.not.exist
      })
    })
  })
})

const { assign } = require('lodash')

const investmentData = require('~/test/unit/data/investment/investment-data.json')
const {
  transformBriefInvestmentSummary,
} = require('~/src/apps/investment-projects/transformers/project')

describe('Investment project transformers', () => {
  describe('#transformBriefInvestmentSummary', () => {
    context('when a project contains data', () => {
      beforeEach(() => {
        this.result = transformBriefInvestmentSummary(investmentData)
      })

      it('sound contain the properties required of a brief investment summary', () => {
        expect(Object.keys(this.result)).to.deep.equal([
          'sector',
          'investor_company',
          'website',
          'account_tier',
          'uk_region_locations',
          'competitor_countries',
          'estimated_land_date',
          'total_investment',
        ])
      })
    })

    context('when an investment company is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            id: '1234',
            name: 'test',
            website: 'http://www.test.com',
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should provide the investor company as a link', () => {
        expect(this.result.investor_company).to.deep.equal({
          name: 'test',
          url: '/companies/1234',
        })
      })
    })

    context('when a sector is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          sector: {
            id: '1234',
            name: 'test',
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the sector name', () => {
        expect(this.result).to.have.property('sector', 'test')
      })
    })

    context('when a sector isn\'t provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          sector: null,
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include a null sector', () => {
        expect(this.result).to.have.property('sector', null)
      })
    })

    context('when an investor company has a website', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            id: '1234',
            name: 'test',
            website: 'http://www.test.com',
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.result).to.have.deep.property('website', {
          name: 'http://www.test.com',
          url: 'http://www.test.com',
        })
      })
    })

    context('when an investor company does not have a website', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            id: '1234',
            name: 'test',
            website: null,
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include a null for the website', () => {
        expect(this.result).to.have.property('website', null)
      })
    })

    context('when investor company has no classification', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            classification: null,
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the website and a link', () => {
        expect(this.result).to.have.property('account_tier', 'None')
      })
    })

    context('when investor company has a malformed classification', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            classification: {
              'colour': 'red',
            },
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should indicate no account tier', () => {
        expect(this.result).to.have.property('account_tier', 'None')
      })
    })

    context('when investor company has a valid classification', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            classification: {
              id: '1321',
              name: 'Test',
            },
          },
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the account tier', () => {
        expect(this.result).to.have.property('account_tier', 'Test')
      })
    })

    context('when uk regions are provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          uk_region_locations: [{
            id: '4321',
            name: 'Region 1',
          }, {
            id: '1234',
            name: 'Region 2',
          }],
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the uk regions as a string list', () => {
        expect(this.result).to.have.property('uk_region_locations', 'Region 1, Region 2')
      })
    })

    context('when uk regions are not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          uk_region_locations: null,
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include an empty value for uk regions', () => {
        expect(this.result).to.have.property('uk_region_locations', '')
      })
    })

    context('when competitor countries are provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          competitor_countries: [{
            id: '4321',
            name: 'Country 1',
          }, {
            id: '1234',
            name: 'Country 2',
          }],
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the competitor countries formatted as a string list', () => {
        expect(this.result).to.have.property('competitor_countries', 'Country 1, Country 2')
      })
    })

    context('when competitor countries are not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          competitor_countries: null,
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include am empty competitor countries value', () => {
        expect(this.result).to.have.property('competitor_countries', '')
      })
    })

    context('when an estimated land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: '2017-01-07',
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the estimated land date formatted as Month Year', () => {
        expect(this.result).to.have.property('estimated_land_date', 'January 2017')
      })
    })

    context('when an estimated land date is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: null,
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should set the estimated land date as null', () => {
        expect(this.result).to.have.property('estimated_land_date', null)
      })
    })

    context('when a malformed estimated land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: 'dog',
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should set estimated land date to null', () => {
        expect(this.result).to.have.property('estimated_land_date', null)
      })
    })

    context('when a total investment is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          total_investment: '100.24',
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should include the total investment value', () => {
        expect(this.result).to.have.property('total_investment', '£100.24')
      })
    })

    context('when a total investment is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          total_investment: null,
        })

        this.result = transformBriefInvestmentSummary(data)
      })

      it('should set total investment to null', () => {
        expect(this.result).to.have.property('total_investment', null)
      })
    })
  })
})

const { assign } = require('lodash')

const { transformInvestmentRequirementsForView } = require('../requirements')

describe('Investment project transformers', () => {
  describe('#transformInvestmentRequirementsForView', () => {
    beforeEach(() => {
      this.investmentData = {
        actual_uk_regions: [{ id: 'a1', name: 'region 1' }],
        client_requirements: 'requirements',
        competitor_countries: [{ id: 'c1', name: 'country 1' }],
        id: 'inv1',
        strategic_drivers: [{ id: 'sd1', name: 'strategic driver 1' }],
        uk_company: {
          id: 'company1',
          name: 'Test company',
        },
        uk_region_locations: [{ id: 'rl1', name: 'region location 1' }],
      }
    })

    context('when called with a fully populated investment', () => {
      beforeEach(() => {
        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(this.investmentData)
      })

      it('should return the required properties', () => {
        expect(
          Object.keys(this.transformedInvestmentRequirements)
        ).to.deep.equal([
          'strategic_drivers',
          'client_requirements',
          'competitor_countries',
          'uk_region_locations',
          'actual_uk_regions',
          'uk_company',
          'delivery_partners',
        ])
      })
    })

    context('when there are no strategic drivers', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          strategic_drivers: [],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return an empty string for strategic drivers', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'strategic_drivers',
          ''
        )
      })
    })

    context('when there is one strategic driver', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          strategic_drivers: [{ id: 'sd1', name: 'strategic driver 1' }],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the strategic driver', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'strategic_drivers',
          'strategic driver 1'
        )
      })
    })

    context('when there are multiple strategic drivers', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          strategic_drivers: [
            { id: 'sd1', name: 'strategic driver 1' },
            { id: 'sd2', name: 'strategic driver 2' },
          ],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the strategic drivers as a string list', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'strategic_drivers',
          'strategic driver 1, strategic driver 2'
        )
      })
    })

    context('when there are client requirements', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          client_requirements: 'Client requirement',
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the client requirement', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'client_requirements',
          'Client requirement'
        )
      })
    })

    context('when client requirements is empty', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          client_requirements: '',
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the client requirement', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'client_requirements',
          ''
        )
      })
    })

    context('when there are no competitor countries', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          competitor_countries: [],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return an empty string for competitor countries', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'competitor_countries',
          ''
        )
      })
    })

    context('when there is one competitor country', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          competitor_countries: [{ id: 'c1', name: 'country 1' }],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the competitor country', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'competitor_countries',
          'country 1'
        )
      })
    })

    context('when there are multiple competitor countries', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          competitor_countries: [
            { id: 'c1', name: 'country 1' },
            { id: 'c2', name: 'country 2' },
          ],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the competitor countries as a string list', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'competitor_countries',
          'country 1, country 2'
        )
      })
    })

    context('when there are no uk region locations', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          uk_region_locations: [],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return an empty string for uk region locations', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'uk_region_locations',
          ''
        )
      })
    })

    context('when there is one uk region location', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          uk_region_locations: [{ id: 'rl1', name: 'region location 1' }],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the uk region location', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'uk_region_locations',
          'region location 1'
        )
      })
    })

    context('when there are multiple uk region locations', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          uk_region_locations: [
            { id: 'rl1', name: 'region location 1' },
            { id: 'rl2', name: 'region location 2' },
          ],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the uk region locations as a string list', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'uk_region_locations',
          'region location 1, region location 2'
        )
      })
    })

    context('when there are no action uk regions', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          actual_uk_regions: [],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return an empty string for actual uk regions', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'actual_uk_regions',
          ''
        )
      })
    })

    context('when there is one actual uk region', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          actual_uk_regions: [{ id: 'a1', name: 'region 1' }],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the uk region location', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'actual_uk_regions',
          'region 1'
        )
      })
    })

    context('when there are multiple uk region locations', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          actual_uk_regions: [
            { id: 'a1', name: 'region 1' },
            { id: 'a2', name: 'region 2' },
          ],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return theactual uk regions as a string list', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'actual_uk_regions',
          'region 1, region 2'
        )
      })
    })

    context('when no uk company is provided', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          id: 1,
          uk_company: null,
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should set the investment details to display a link to find a company', () => {
        expect(this.transformedInvestmentRequirements.uk_company).to.deep.equal(
          {
            name: 'Find company',
            url: `/investments/projects/1/edit-ukcompany`,
          }
        )
      })
    })

    context('when a uk company has previously been set', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          id: 1,
          uk_company: {
            id: '1234',
            name: 'Freds',
          },
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should set the investment details to display the company name', () => {
        expect(this.transformedInvestmentRequirements.uk_company.name).to.equal(
          'Freds'
        )
      })

      it('should set the investment details to display an action to edit the company money is going through', () => {
        expect(
          this.transformedInvestmentRequirements.uk_company.actions[0]
        ).to.deep.equal({
          label: 'Edit company',
          url: `/investments/projects/1/edit-ukcompany?term=Freds`,
        })
      })

      it('should set the investment details to display an action to remove the company the money is going through', () => {
        expect(
          this.transformedInvestmentRequirements.uk_company.actions[1]
        ).to.deep.equal({
          label: 'Remove company',
          url: `/investments/projects/1/remove-ukcompany`,
        })
      })
    })

    context('when there are no delivery partners', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          delivery_partners: [],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return an empty string for delivery partners', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'delivery_partners',
          ''
        )
      })
    })

    context('when there is one delivery partner', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          delivery_partners: [{ id: 'dp1', name: 'Delivery partner 1' }],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the delivery partner', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'delivery_partners',
          'Delivery partner 1'
        )
      })
    })

    context('when there are multiple delivery parnters', () => {
      beforeEach(() => {
        const data = assign({}, this.investmentData, {
          delivery_partners: [
            { id: 'dp1', name: 'Delivery partner 1' },
            { id: 'dp2', name: 'Delivery partner 2' },
          ],
        })

        this.transformedInvestmentRequirements =
          transformInvestmentRequirementsForView(data)
      })

      it('should return the delivery partners as a string list', () => {
        expect(this.transformedInvestmentRequirements).to.have.property(
          'delivery_partners',
          'Delivery partner 1, Delivery partner 2'
        )
      })
    })
  })
})

const { assign } = require('lodash')

const investmentData = require('../../../../../test/unit/data/investment/investment-data.json')
const {
  transformInvestmentForView,
  transformToApi,
  transformFromApi,
} = require('../project')

describe('Investment project transformers', () => {
  describe('#transformInvestmentForView', () => {
    context('when called with a fully populated investment', () => {
      beforeEach(() => {
        this.result = transformInvestmentForView(investmentData)
      })

      it('should include all the required properties', () => {
        expect(Object.keys(this.result)).to.deep.equal([
          'investor_company',
          'investment_type',
          'sector',
          'business_activities',
          'client_contacts',
          'description',
          'anonymous_description',
          'investor_type',
          'level_of_involvement',
          'specific_programme',
          'estimated_land_date',
          'actual_land_date',
        ])
      })
    })

    context('when called with an investor company', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_company: {
            name: 'test',
            id: '1234',
          },
        })
        this.result = transformInvestmentForView(data)
      })

      it('should provide the investor company as a link', () => {
        expect(this.result.investor_company).to.deep.equal({
          name: 'test',
          url: '/companies/1234',
        })
      })
    })

    context('when called with an investment type', () => {
      beforeEach(() => {
        this.result = transformInvestmentForView(investmentData)
      })

      it('should return a formatted investment type value', () => {
        expect(this.result).to.have.property(
          'investment_type',
          'FDI, Capital only'
        )
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

        this.result = transformInvestmentForView(data)
      })

      it('should include the sector name', () => {
        expect(this.result.sector).to.deep.equal({
          id: '1234',
          name: 'test',
        })
      })
    })

    context("when a sector isn't provided", () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          sector: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include a null sector', () => {
        expect(this.result).to.have.property('sector', null)
      })
    })

    context(
      'when there is are business activities but no other activities',
      () => {
        beforeEach(() => {
          const data = assign({}, investmentData, {
            business_activities: [
              {
                name: 'Call centre',
                id: '410da69e-0247-48cf-9f72-fbc10ed7a4fc',
              },
              {
                name: 'Sales',
                id: '410da69e-0247-48cf-9f72-fbc10ed7a4fd',
              },
            ],
            other_business_activity: '',
          })

          this.result = transformInvestmentForView(data)
        })

        it('should return business activities formatted as a string list', () => {
          expect(this.result).to.have.property(
            'business_activities',
            'Call centre, Sales'
          )
        })
      }
    )

    context(
      'when there are no business activies but there is another activity',
      () => {
        beforeEach(() => {
          const data = assign({}, investmentData, {
            business_activities: [],
            other_business_activity: 'Surfing',
          })

          this.result = transformInvestmentForView(data)
        })

        it('should return business activities formatted as a string list', () => {
          expect(this.result).to.have.property('business_activities', 'Surfing')
        })
      }
    )

    context('when there no business activities and no other activities', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          business_activities: [],
          other_business_activity: '',
        })

        this.result = transformInvestmentForView(data)
      })

      it('should return business activities as an empty string', () => {
        expect(this.result).to.have.property('business_activities', '')
      })
    })

    context('when there are client contacts to show', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          client_contacts: [
            {
              name: 'Allen Connelly',
              id: '7aac69c2-7af4-4c79-9622-f25eb7690f36',
            },
            {
              name: 'John Brown',
              id: '7aac69c2-7ae4-4c79-9622-f25eb7690f36',
            },
          ],
        })

        this.result = transformInvestmentForView(data)
      })

      it("should return the contact list as an object (including contact' URL", () => {
        expect(this.result.client_contacts).to.have.property('name')
      })
    })

    context('when there is a single client contact', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          client_contacts: [
            {
              name: 'Allen Connelly',
              id: '7aac69c2-7af4-4c79-9622-f25eb7690f36',
            },
          ],
        })

        this.result = transformInvestmentForView(data)
      })

      it('should return an object with the contact name', () => {
        expect(this.result.client_contacts).to.have.property(
          'name',
          'Allen Connelly'
        )
      })

      it("should return an object with the url pointing to the contact's page", () => {
        expect(this.result.client_contacts).to.have.property(
          'url',
          '/contacts/7aac69c2-7af4-4c79-9622-f25eb7690f36'
        )
      })
    })

    context('when there are no client contacts to show', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          client_contacts: [],
        })

        this.result = transformInvestmentForView(data)
      })

      it('should return an empty client contact', () => {
        expect(this.result).to.have.property('client_contacts', null)
      })
    })

    context('when a description is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          description: 'My description',
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the description', () => {
        expect(this.result).to.have.property('description', 'My description')
      })
    })

    context("when a description isn't provided", () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          description: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include a null description', () => {
        expect(this.result).to.have.property('description', null)
      })
    })

    context('when an anonymous description is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          anonymous_description: 'My description',
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the description', () => {
        expect(this.result).to.have.property(
          'anonymous_description',
          'My description'
        )
      })
    })

    context("when an anonymous description isn't provided", () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          anonymous_description: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include a null anonymous description', () => {
        expect(this.result).to.have.property('anonymous_description', null)
      })
    })

    context('when a investor type is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_type: {
            name: 'Existing Investor',
            id: '40e33f91-f565-4b89-8e18-cfefae192245',
          },
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the description', () => {
        expect(this.result.investor_type).to.deep.equal({
          name: 'Existing Investor',
          id: '40e33f91-f565-4b89-8e18-cfefae192245',
        })
      })
    })

    context("when an investor type isn't provided", () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          investor_type: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include a null anonymous description', () => {
        expect(this.result).to.have.property('investor_type', null)
      })
    })

    context('when level of involvement is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          level_of_involvement: {
            name: 'HQ Only',
            id: '9c22137d-648e-4ecb-8fe7-652ac6a4f53a',
          },
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the level of involvement', () => {
        expect(this.result.level_of_involvement).to.deep.equal({
          name: 'HQ Only',
          id: '9c22137d-648e-4ecb-8fe7-652ac6a4f53a',
        })
      })
    })

    context("when a level of involvement isn't provided", () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          level_of_involvement: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include a null level of involvement', () => {
        expect(this.result).to.have.property('level_of_involvement', null)
      })
    })

    context('when a specific programme is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          specific_programme: {
            name: 'Screen Production Investment',
            id: 'ba042912-cd42-41b3-b813-b9f26a913331',
          },
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the specific programme', () => {
        expect(this.result.specific_programme).to.deep.equal({
          name: 'Screen Production Investment',
          id: 'ba042912-cd42-41b3-b813-b9f26a913331',
        })
      })
    })

    context("when a specific programme isn't provided", () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          specific_programme: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include a null for specific programme', () => {
        expect(this.result).to.have.property('specific_programme', null)
      })
    })

    context('when an estimated land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: '2017-01-07',
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the estimated land date formatted as Month Year', () => {
        expect(this.result).to.have.property(
          'estimated_land_date',
          'January 2017'
        )
      })
    })

    context('when an estimated land date is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should set the estimated land date as null', () => {
        expect(this.result).to.have.property('estimated_land_date', null)
      })
    })

    context('when an actual land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          actual_land_date: '2017-01-07',
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the actual land date as a date property', () => {
        expect(this.result.actual_land_date).deep.equal({
          type: 'date',
          name: '2017-01-07',
        })
      })
    })

    context('when an actual land date is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          actual_land_date: null,
        })

        this.result = transformInvestmentForView(data)
      })

      it('should include the actual land date as a date property with null value', () => {
        expect(this.result.actual_land_date).to.be.null
      })
    })
  })

  describe('#transformToApi', () => {
    context('when called with an actual land date', () => {
      beforeEach(() => {
        this.result = transformToApi({
          actual_land_date_day: '1',
          actual_land_date_month: '10',
          actual_land_date_year: '2016',
        })
      })

      it('should convert the field values into a date value', () => {
        expect(this.result).to.have.property('actual_land_date', '2016-10-1')
      })
    })

    context('when called with a partial actual land date', () => {
      beforeEach(() => {
        this.result = transformToApi({
          actual_land_date_day: '1',
          actual_land_date_year: '2016',
        })
      })

      it('should return a malformed date for incomplete dates', () => {
        expect(this.result).to.have.property('actual_land_date', '2016--1')
      })
    })

    context('when called with no actual land date', () => {
      beforeEach(() => {
        this.result = transformToApi({
          name: 'fred',
        })
      })

      it('should set the actual land date value to null', () => {
        expect(this.result).to.have.property('actual_land_date', null)
      })
    })
  })

  context('when called with an estimated land date', () => {
    beforeEach(() => {
      this.result = transformToApi({
        estimated_land_date_month: '10',
        estimated_land_date_year: '2016',
      })
    })

    it('should convert the field values into a date value', () => {
      expect(this.result).to.have.property('estimated_land_date', '2016-10-01')
    })
  })

  context('when called with a partial estimated land date', () => {
    beforeEach(() => {
      this.result = transformToApi({
        estimated_land_date_year: '2016',
      })
    })

    it('should return a malformed date', () => {
      expect(this.result).to.have.property('estimated_land_date', '2016--01')
    })
  })

  context('when called with no estimated land date', () => {
    beforeEach(() => {
      this.result = transformToApi({
        name: 'fred',
      })
    })

    it('should set the estimated land date value to null', () => {
      expect(this.result).to.have.property('estimated_land_date', null)
    })
  })

  describe('#transformFromApi', () => {
    context('when an estimated land date is provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: '2017-12-15T14:25:38.989026Z',
        })

        this.result = transformFromApi(data)
      })

      it('should create a split date for month and year', () => {
        expect(this.result).to.have.property('estimated_land_date_year', '2017')
        expect(this.result).to.have.property('estimated_land_date_month', '12')
      })
    })

    context('when an estimated land date is not provided', () => {
      beforeEach(() => {
        const data = assign({}, investmentData, {
          estimated_land_date: null,
        })

        this.result = transformFromApi(data)
      })

      it('should not create a split date for month and year', () => {
        expect(this.result).to.not.have.property('estimated_land_date_year')
        expect(this.result).to.not.have.property('estimated_land_date_month')
      })
    })
  })
})

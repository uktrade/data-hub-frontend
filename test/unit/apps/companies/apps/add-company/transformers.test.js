const {
  transformToDnbCompanyInvestigationApi,
} = require('~/src/apps/companies/apps/add-company/transformers')

describe('Companies add company transformers', () => {
  describe('#transformToDnbCompanyInvestigationApi', () => {
    beforeEach(() => {
      this.actual = transformToDnbCompanyInvestigationApi({
        business_type: '1',
        name: 'name',
        website: 'website',
        telephone_number: '123',
        uk_region: '2',
        sector: '3',
      })
    })

    it('should transform the request body', () => {
      expect(this.actual).to.deep.equal({
        address: {
          country: {
            id: '80756b9a-5d95-e211-a939-e4115bead28a',
          },
          county: null,
          line_1: 'Unit 10, Ockham Drive',
          line_2: null,
          postcode: 'UB6 0F2',
          town: 'GREENFORD',
        },
        business_type: '1',
        name: 'name',
        sector: '3',
        telephone_number: '123',
        uk_region: '2',
        website: 'website',
      })
    })
  })
})

const faker = require('faker')
const {
  transformToDnbStubCompany,
  transformToCreateDnbCompanyInvestigation,
  transformFormData,
} = require('../transformers')

describe('Companies add company transformers', () => {
  describe('#transformToDnbStubCompany', () => {
    context('when all fields are populated', () => {
      let actual

      beforeEach(() => {
        actual = transformToDnbStubCompany(
          {
            business_type: '1',
            name: 'name',
            website: 'website',
            telephone_number: '123',
            address1: 'line 1',
            address2: 'line 2',
            city: 'town',
            county: 'county',
            postcode: 'postcode',
            country: 'country',
            uk_region: '2',
            sector: '3',
            area: 'area',
          },
          { locals: { features: { 'address-area-company-search': true } } }
        )
      })

      it('should transform the request body', () => {
        expect(actual).to.deep.equal({
          address: {
            area: {
              id: 'area',
            },
            country: {
              id: 'country',
            },
            county: 'county',
            line_1: 'line 1',
            line_2: 'line 2',
            postcode: 'postcode',
            town: 'town',
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

    context('when address line 2 and county are null', () => {
      let actual

      beforeEach(() => {
        actual = transformToDnbStubCompany(
          {
            business_type: '1',
            name: 'name',
            website: 'website',
            telephone_number: '123',
            address1: 'line 1',
            address2: null,
            city: 'town',
            county: null,
            postcode: 'postcode',
            country: 'country',
            uk_region: '2',
            sector: '3',
            area: 'area',
          },
          { locals: { features: { 'address-area-company-search': true } } }
        )
      })

      it('should transform the request body with empty strings', () => {
        expect(actual).to.deep.equal({
          address: {
            area: {
              id: 'area',
            },
            country: {
              id: 'country',
            },
            county: '',
            line_1: 'line 1',
            line_2: '',
            postcode: 'postcode',
            town: 'town',
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

    context('when address-area-company-search feature flag is false', () => {
      let actual

      beforeEach(() => {
        actual = transformToDnbStubCompany(
          {
            business_type: '1',
            name: 'name',
            website: 'website',
            telephone_number: '123',
            address1: 'line 1',
            address2: 'line 2',
            city: 'town',
            county: 'county',
            postcode: 'postcode',
            country: 'country',
            uk_region: '2',
            sector: '3',
            area: 'area',
          },
          { locals: { features: { 'address-area-company-search': false } } }
        )
      })

      it('should omit the area field', () => {
        expect(actual).to.deep.equal({
          address: {
            country: {
              id: 'country',
            },
            county: 'county',
            line_1: 'line 1',
            line_2: 'line 2',
            postcode: 'postcode',
            town: 'town',
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

  describe('#transformToCreateDnbCompanyInvestigation', () => {
    context('when all fields are populated', () => {
      let actual = transformToCreateDnbCompanyInvestigation(
        {
          name: 'name',
          website: 'website',
          telephone_number: '123',
          address1: 'line 1',
          address2: 'line 2',
          city: 'town',
          county: 'county',
          postcode: 'postcode',
          area: 'area',
          country: 'country',
        },
        '123',
        { locals: { features: { 'address-area-company-search': true } } }
      )

      it('should transform the request body', () => {
        expect(actual).to.deep.equal({
          company: '123',
          name: 'name',
          website: 'website',
          telephone_number: '123',
          address: {
            line_1: 'line 1',
            line_2: 'line 2',
            town: 'town',
            county: 'county',
            postcode: 'postcode',
            area: {
              id: 'area',
            },
            country: 'country',
          },
        })
      })
    })

    context('when address-area-company-search feature flag is false', () => {
      let actual = transformToCreateDnbCompanyInvestigation(
        {
          name: 'name',
          website: 'website',
          telephone_number: '123',
          address1: 'line 1',
          address2: 'line 2',
          city: 'town',
          county: 'county',
          postcode: 'postcode',
          country: 'country',
          area: 'area',
        },
        '123',
        { locals: { features: { 'address-area-company-search': false } } }
      )

      it('should omit the area field', () => {
        expect(actual).to.deep.equal({
          company: '123',
          name: 'name',
          website: 'website',
          telephone_number: '123',
          address: {
            line_1: 'line 1',
            line_2: 'line 2',
            town: 'town',
            county: 'county',
            postcode: 'postcode',
            country: 'country',
          },
        })
      })
    })
  })

  describe('#transformFormData', () => {
    context('when area is populated', () => {
      it('returns area correctly', () => {
        const area = faker.datatype.uuid
        const formData = {
          name: faker.name,
          website: faker.internet.domainName,
          telephone_number: faker.phone,
          address1: faker.address.streetAddress,
          address2: faker.address.streetAddress,
          city: faker.address.city,
          county: faker.address.county,
          postcode: faker.address.zipCode,
          country: faker.address.country,
          area: area,
        }
        const response = transformFormData(formData, {
          locals: { features: { 'address-area-company-search': true } },
        })
        const expected = {
          name: formData.name,
          website: formData.website,
          telephone_number: formData.telephone_number,
          address: {
            line_1: formData.address1,
            line_2: formData.address2 || '',
            town: formData.city,
            county: formData.county || '',
            postcode: formData.postcode,
            country: { id: formData.country },
            area: { id: formData.area },
          },
        }

        expect(response).to.deep.equal(expected)
      })
    })

    context('when area is undefined', () => {
      it('returns area as undefined without an id', () => {
        const area = undefined
        const formData = {
          name: faker.name,
          website: faker.internet.domainName,
          telephone_number: faker.phone,
          address1: faker.address.streetAddress,
          address2: faker.address.streetAddress,
          city: faker.address.city,
          county: faker.address.county,
          postcode: faker.address.zipCode,
          country: faker.address.country,
          area: area,
        }
        const response = transformFormData(formData, {
          locals: { features: { 'address-area-company-search': true } },
        })
        const expected = {
          name: formData.name,
          website: formData.website,
          telephone_number: formData.telephone_number,
          address: {
            line_1: formData.address1,
            line_2: formData.address2 || '',
            town: formData.city,
            county: formData.county || '',
            postcode: formData.postcode,
            country: { id: formData.country },
            area: undefined,
          },
        }

        expect(response).to.deep.equal(expected)
      })
    })
  })
})

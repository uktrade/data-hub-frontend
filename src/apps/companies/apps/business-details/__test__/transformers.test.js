const { transformCompanyToBusinessDetails } = require('../transformers')

const companyMock = require('../../../../../../test/unit/data/companies/company-v4')

describe('Company business details transformers', () => {
  describe('#transformCompanyToBusinessDetails', () => {
    context('when called with a fully populated company', () => {
      it('should return transformed values', () => {
        const company = {
          ...companyMock,
          headquarter_type: {
            name: 'ghq',
          },
        }

        const actual = transformCompanyToBusinessDetails(company)

        const expected = {
          id: 'a73efeba-8499-11e6-ae22-56b6b6499611',
          address: {
            line_1: '82 Ramsgate Rd',
            line_2: '',
            town: 'Willington',
            county: '',
            postcode: 'NE28 5JB',
            country: {
              name: 'United Kingdom',
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
            },
          },
          description: 'This is a dummy company for testing',
          registered_address: {
            line_1: '82 Ramsgate Rd',
            line_2: '',
            town: 'Willington',
            county: '',
            postcode: 'NE28 5JB',
            country: {
              name: 'United Kingdom',
              id: '80756b9a-5d95-e211-a939-e4115bead28a',
            },
          },
          name: 'Mercury Ltd',
          trading_names: [],
          company_number: '99919',
          created_on: '2016-06-05T12:00:00Z',
          modified_on: '2016-07-05T12:00:00Z',
          uk_based: true,
          headquarter_type: {
            name: 'ghq',
          },
          business_type: 'Private limited company',
          turnover_range: '£33.5M+',
          employee_range: '500+',
          sector: 'Retail',
          uk_region: 'North West',
          one_list_group_tier: 'Tier A - Strategic Account',
          one_list_group_global_account_manager: [
            'Travis Greene',
            'IST - Sector Advisory Services',
            'London',
          ],
          headquarter_type_label: 'Global HQ',
          export_segment: 'hep',
          export_sub_segment: 'sustain_nurture_and_grow',
        }

        expect(actual).to.deep.equal(expected)
      })

      it('should not error when the "One list account owner" is not set', () => {
        const company = {
          one_list_group_tier: { name: 'Tier A - Strategic Account' },
          one_list_group_global_account_manager: null,
        }
        const actual = transformCompanyToBusinessDetails(company)
        expect(actual).to.deep.equal({
          one_list_group_tier: 'Tier A - Strategic Account',
        })
      })
    })

    context('when called without any fields', () => {
      const actual = transformCompanyToBusinessDetails({})

      it('should return empty object', () => {
        expect(actual).to.deep.equal({})
      })
    })
  })
})

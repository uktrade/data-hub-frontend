const formattingService = require('~/src/apps/companies-house/services/formatting')
const companiesHouseData = require('../../../data/companies-house.json')

describe('Companies house formatting service', () => {
  it('should return formatted companies house information', () => {
    const expected = {
      name: 'Amazon Savers',
      company_number: '02658484',
      business_type: 'Private Limited Company',
      company_status: 'Active',
      registered_address: '52a High Street, Sheffield, S20 1ED, United Kingdom',
      incorporation_date: '6 February 2012',
      sic_code: [
        '82990 - Other business support service activities n.e.c.',
        '82991 - Other business support service activities n.e.c.',
      ],
    }

    const formattedCompaniesHouseData = formattingService.getDisplayCompaniesHouse(companiesHouseData)

    expect(formattedCompaniesHouseData).to.deep.equal(expected)
  })
})

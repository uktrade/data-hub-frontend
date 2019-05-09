/* eslint-disable camelcase */
const { capitalize } = require('lodash')

const { transformSicCodes } = require('./shared')

module.exports = function transformCompaniesHouseToListItem ({
  name,
  registered_address,
  company_number,
  company_category,
  company_status,
  sic_code_1,
  sic_code_2,
  sic_code_3,
  sic_code_4,
  incorporation_date,
}) {
  const sicCodes = transformSicCodes({ sic_code_1, sic_code_2, sic_code_3, sic_code_4 })

  return {
    name: capitalize(name),
    id: company_number,
    type: 'companies_house',
    url: `/view/ch/${company_number}`,
    meta: [
      {
        label: 'Status',
        value: company_status,
        type: 'badge',
      },
      {
        label: 'Company number',
        value: company_number,
      },
      {
        label: 'Type',
        value: company_category,
      },
      {
        label: 'Nature of business (SIC)',
        value: sicCodes,
      },
      {
        label: 'Incorporated on',
        value: incorporation_date,
        type: 'date',
      },
      {
        label: 'Address',
        type: 'address',
        value: registered_address,
      },
    ],
  }
}

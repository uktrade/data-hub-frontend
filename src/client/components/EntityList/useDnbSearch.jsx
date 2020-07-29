/* eslint-disable camelcase */

import axios from 'axios'
import { compact, isEmpty } from 'lodash'

function getTradingNames(dnb_company) {
  return isEmpty(dnb_company.trading_names)
    ? null
    : {
        label: 'Trading name(s)',
        value: dnb_company.trading_names.join(', '),
      }
}

function getAddress(dnb_company) {
  return {
    label: 'Location at',
    value: compact([
      dnb_company.address_line_1,
      dnb_company.address_line_2,
      dnb_company.address_town,
      dnb_company.address_county,
      dnb_company.address_postcode,
    ]).join(', '),
  }
}

function useDnbSearch(apiEndpoint) {
  function transformCompanyRecord(record) {
    const { dnb_company } = record

    return {
      id: dnb_company.duns_number,
      heading: dnb_company.primary_name,
      meta: compact([getTradingNames(dnb_company), getAddress(dnb_company)]),
      data: record,
    }
  }

  async function findCompany(filters) {
    const { data } = await axios.post(apiEndpoint, filters)

    return data.results.map(transformCompanyRecord)
  }

  return {
    findCompany,
    transformCompanyRecord,
  }
}

export default useDnbSearch

import React from 'react'
import PropTypes from 'prop-types'
import { throttle, compact, isEmpty } from 'lodash'
import axios from 'axios'

import { getCompanyAddress } from '../../../../utils/addresses'
import FieldTypeahead from '../FieldTypeahead'

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
    value: getCompanyAddress(dnb_company),
  }
}

const FieldCompanyDnBTypeahead = ({
  name,
  label,
  required,
  placeholder = 'Type to search for companies',
  loadOptions,
  csrfToken,
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder={placeholder}
      noOptionsMessage="Type to search for companies"
      required={required}
      loadOptions={throttle((searchString) => {
        if (searchString.length > 2) {
          return axios
            .post(`/companies/create/dnb/company-search?_csrf=${csrfToken}`, {
              search_term: searchString,
              address_country: 'GB',
            })
            .then(({ data }) =>
              data.results.map((result) => ({
                chipLabel: result.dnb_company.primary_name,
                label: result.dnb_company.primary_name,
                value: result.dnb_company.duns_number,
                id: result.dnb_company.duns_number,
                meta: compact([
                  getTradingNames(result.dnb_company),
                  getAddress(result.dnb_company),
                ]),
                data: result,
              }))
            )
        } else {
          return Promise.resolve([])
        }
      }, 500)}
      isMulti={false}
      {...props}
    />
  )
}

FieldCompanyDnBTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  csrfToken: PropTypes.string.isRequired,
  required: PropTypes.string,
  placeholder: PropTypes.string,
}

export default FieldCompanyDnBTypeahead

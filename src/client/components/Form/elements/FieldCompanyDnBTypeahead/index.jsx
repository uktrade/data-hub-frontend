import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, compact } from 'lodash'
import axios from 'axios'

import { getCompanyAddress } from '../../../../utils/addresses'
import FieldTypeahead from '../FieldTypeahead'
import { getDnbEntityText } from '../../../../../apps/companies/apps/add-company/client/CompanySearchStep'

function getTradingNames(dnb_company) {
  return isEmpty(dnb_company.trading_names)
    ? null
    : {
        label: 'Trading name(s)',
        value: dnb_company.trading_names.join(', '),
      }
}

function getMetaData(dnb_company) {
  return compact([
    getTradingNames(dnb_company),
    {
      label: 'Location at',
      value: getCompanyAddress(dnb_company),
    },
  ])
}

const FieldCompanyDnBTypeahead = ({
  name,
  label,
  required,
  placeholder = 'Type to search for companies',
  loadOptions,
  apiEndpoint,
  postcode,
  country,
  ...props
}) => {
  return (
    <FieldTypeahead
      name={name}
      label={label}
      placeholder={placeholder}
      noOptionsMessage="No company found, try adding postcode or manually create company"
      required={required}
      showMetaData={true}
      showInsetText={true}
      isMulti={false}
      loadOptions={(searchString) => {
        if (searchString.length > 1) {
          const post_data = {
            search_term: searchString,
            address_country: country,
          }
          if (postcode) {
            post_data.postal_code = postcode
          }
          return axios
            .post(apiEndpoint, post_data)
            .then(({ data }) =>
              data.results.map((result) => ({
                dnb_company: result.dnb_company,
                chipLabel: result.dnb_company.primary_name,
                label: result.dnb_company.primary_name,
                value: result.dnb_company.duns_number,
                id: result.dnb_company.duns_number,
                meta: getMetaData(result.dnb_company),
                insetText: getDnbEntityText(
                  result.datahub_company?.id,
                  result.dnb_company.is_out_of_business,
                  result.dnb_company.primary_name
                ),
                isDisabled:
                  result.datahub_company?.id ||
                  result.dnb_company.is_out_of_business
                    ? true
                    : false,
              }))
            )
            .catch(() => {
              return [
                {
                  label: 'Error searching the D&B API',
                  value: '',
                  isError: true,
                  isDisabled: true,
                },
              ]
            })
        } else {
          return Promise.resolve([{ label: '', value: '' }])
        }
      }}
      {...props}
    />
  )
}

FieldCompanyDnBTypeahead.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.string,
  placeholder: PropTypes.string,
}

export default FieldCompanyDnBTypeahead

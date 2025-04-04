import React from 'react'
import PropTypes from 'prop-types'
import { throttle, compact } from 'lodash'
import axios from 'axios'

import { getCompanyAddress } from '../../../../utils/addresses'
import FieldTypeahead from '../FieldTypeahead'
import { getDnbEntityText } from '../../../../../apps/companies/apps/add-company/client/CompanySearchStep'

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
      showMetaData={true}
      showInsetText={true}
      loadOptions={throttle((searchString) => {
        if (searchString.length > 1) {
          return axios
            .post(`/companies/create/dnb/company-search?_csrf=${csrfToken}`, {
              search_term: searchString,
              address_country: 'GB',
            })
            .then(({ data }) =>
              data.results.map((result) => ({
                dnb_company: result.dnb_company,
                chipLabel: result.dnb_company.primary_name,
                label: result.dnb_company.primary_name,
                value: result.dnb_company.duns_number,
                id: result.dnb_company.duns_number,
                meta: compact([getAddress(result.dnb_company)]),
                insetText: getDnbEntityText(
                  result.datahub_company?.id,
                  result.dnb_company.is_out_of_business,
                  result.dnb_company.primary_name
                ),
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

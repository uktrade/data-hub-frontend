import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { WIDTHS } from '@govuk-react/constants'
import Button from '@govuk-react/button'

import { useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import FieldUneditable from '../FieldUneditable'
import FieldInput from '../FieldInput'
import FieldCompanyDnBTypeahead from '../FieldCompanyDnBTypeahead'
import useEntitySearch from '../../../EntityList/useEntitySearch'
import useDnbSearch from '../../../EntityList/useDnbSearch'
import FormActions from '../FormActions'
import FormLayout from '../../../Layout/FormLayout'
import { FORM_LAYOUT } from '../../../../../common/constants'

const FieldDnbCompany = ({
  name,
  label,
  legend,
  hint,
  country,
  apiEndpoint,
  onCompanySelect,
  csrfToken,
  features,
}) => {
  const { values, goBack, setIsLoading } = useFormContext()
  const { findCompany } = useDnbSearch(apiEndpoint, features)
  const { searching } = useEntitySearch(findCompany)

  useEffect(() => setIsLoading(searching), [searching])

  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <FieldWrapper {...{ name, label, legend, hint }}>
        {country && (
          <FieldUneditable
            legend="Country"
            name="dnbCountry"
            onChangeClick={goBack}
          >
            {country}
          </FieldUneditable>
        )}

        <FieldInput
          label="Company postcode (optional)"
          name="dnbPostalCode"
          style={{ width: WIDTHS['one-third'] }}
          type="search"
        />

        <FieldCompanyDnBTypeahead
          name="companyDnB"
          aria-label="Search a company"
          label="Company Name"
          required="Search a company"
          csrfToken={csrfToken}
        />

        <FormActions>
          <Button
            onClick={() => {
              onCompanySelect(values.companyDnB.dnb_company)
            }}
          >
            Select company
          </Button>
        </FormActions>
      </FieldWrapper>
    </FormLayout>
  )
}

FieldDnbCompany.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
  legend: PropTypes.node,
  hint: PropTypes.node,
  country: PropTypes.string,
  apiEndpoint: PropTypes.string.isRequired,
  queryParams: PropTypes.shape({}),
  entityRenderer: PropTypes.func,
  onCompanySelect: PropTypes.func,
  onCannotFind: PropTypes.func,
  searchResultsMessage: PropTypes.string,
}

export default FieldDnbCompany

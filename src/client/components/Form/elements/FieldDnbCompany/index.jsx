import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { WIDTHS, SPACING } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import ListItem from '@govuk-react/list-item'
import Paragraph from '@govuk-react/paragraph'
import UnorderedList from '@govuk-react/unordered-list'

import ButtonLink from '../../../ButtonLink'
import { useFormContext } from '../../hooks'
import FieldWrapper from '../FieldWrapper'
import FieldUneditable from '../FieldUneditable'
import FieldInput from '../FieldInput'
import FieldCompanyDnBTypeahead from '../FieldCompanyDnBTypeahead'
import FormActions from '../FormActions'
import FormLayout from '../../../Layout/FormLayout'
import { FORM_LAYOUT } from '../../../../../common/constants'

const StyledUnorderedList = styled(UnorderedList)`
  list-style-type: disc;
  padding-left: ${SPACING.SCALE_5};
`

const FieldDnbCompany = ({
  name,
  label,
  apiEndpoint,
  legend,
  hint,
  country,
  onCompanySelect,
  onCannotFind,
  csrfToken,
  queryParams,
  allResultsSelectable,
}) => {
  const { values, goBack } = useFormContext()

  return (
    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
      <FieldWrapper {...{ name, label, legend, hint }}>
        {country && (
          <FieldUneditable
            legend="Country"
            name="dnbCountry"
            onChangeClick={() => {
              // Reset the selected company when going "back" to country selection as going forward
              // again with the same or new country allows the user to submit the previous selected
              // company without anything in the input.
              values.companyDnB = null
              goBack()
            }}
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
          allResultsSelectable={allResultsSelectable}
          apiEndpoint={apiEndpoint}
          aria-label="Search a company"
          label="Company name"
          required="Search for and select a company."
          postcode={values.dnbPostalCode}
          country={queryParams.address_country}
          csrfToken={csrfToken}
        />

        <FormActions>
          <Button
            data-test="select-company-button"
            onClick={() => {
              if (!values.companyDnB) {
                return
              }
              onCompanySelect(values.companyDnB.dnb_company)
            }}
          >
            Submit
          </Button>
        </FormActions>

        <Details summary="I can't find what I'm looking for">
          <Paragraph>Try:</Paragraph>

          <StyledUnorderedList>
            <ListItem>checking or removing the postcode</ListItem>
            <ListItem>removing &quot;limited&quot; or &quot;ltd&quot;</ListItem>
            <ListItem>checking for spelling errors</ListItem>
            {country && (
              <ListItem>checking if the right country was selected</ListItem>
            )}
            <ListItem>
              check you&apos;re using the company&apos;s registered name
            </ListItem>
          </StyledUnorderedList>

          {onCannotFind && (
            <ButtonLink onClick={onCannotFind}>
              I still can&apos;t find what I&apos;m looking for
            </ButtonLink>
          )}
        </Details>
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
  // When true, allows all results to be selected whether they are out of business or already on
  // datahub. Also stops showing additional metadata on the typeahead items.
  allResultsSelectable: PropTypes.bool.isRequired,
}

export default FieldDnbCompany

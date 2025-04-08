import React, { useEffect } from 'react'
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
import useEntitySearch from '../../../EntityList/useEntitySearch'
import useDnbSearch from '../../../EntityList/useDnbSearch'
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
  legend,
  hint,
  country,
  apiEndpoint,
  onCompanySelect,
  onCannotFind,
  csrfToken,
  features,
  queryParams,
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
          postcode={values.dnbPostalCode}
          country={queryParams.address_country}
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
}

export default FieldDnbCompany

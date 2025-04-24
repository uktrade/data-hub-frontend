import React from 'react'
import { isEmpty } from 'lodash'
import pluralize from 'pluralize'
import styled from 'styled-components'
import LoadingBox from '@govuk-react/loading-box'
import { H3 } from '@govuk-react/heading'
import Button from '@govuk-react/button'
import {
  FONT_SIZE,
  FONT_WEIGHTS,
  BORDER_WIDTH,
  LINE_HEIGHT,
  SPACING,
  MEDIA_QUERIES,
} from '@govuk-react/constants'

import {
  BLACK,
  GREY_2,
  GREY_4,
  YELLOW_25,
} from '../../../../../client/utils/colours'

import FormActions from '../FormActions'
import FieldWrapper from '../FieldWrapper'
import FieldInput from '../FieldInput'
import EntityList from '../../../EntityList'
import EntityListItem from '../../../EntityList/EntityListItem'
import { useFormContext } from '../../../../../client/components/Form/hooks'
import urls from '../../../../../lib/urls'
import AccessibleLink from '../../../Link'

const COMPANY_NAME_MIN_LENGTH = 2
const COMPANY_NAME_MAX_LENGTH = 30

const validateMinLength = (minLength) => (value) =>
  value && value.length < minLength
    ? `Enter at least ${pluralize('character', minLength, true)}`
    : null

const validateMaxLength = (maxLength) => (value) =>
  value && value.length > maxLength
    ? `${pluralize('character', value.length - maxLength, true)} too long`
    : null

const CompanyItemRenderer = (item) => {
  const { setFieldValue, goForward } = useFormContext()

  function onEntityClick(company) {
    setFieldValue('company', company)
    goForward()
  }

  return <EntityListItem onEntityClick={onEntityClick} {...item} />
}

const StyledHeader = styled('header')({
  borderBottom: `${BORDER_WIDTH} solid ${BLACK}`,
  marginBottom: SPACING.SCALE_2,
})

const StyledHeading = styled(H3)({
  marginBottom: 0,
})

const StyledCount = styled('span')({
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: FONT_SIZE.SIZE_24,
  [MEDIA_QUERIES.TABLET]: {
    fontSize: FONT_SIZE.SIZE_27,
  },
})

const StyledSearchTerm = styled('span')({
  backgroundColor: YELLOW_25,
})

const StyledParagraph = styled('p')({
  background: GREY_4,
  fontWeight: FONT_WEIGHTS.regular,
  borderLeft: `${BORDER_WIDTH} solid ${GREY_2}`,
  marginTop: SPACING.SCALE_2,
  fontSize: FONT_SIZE.SIZE_16,
  lineHeight: LINE_HEIGHT.SIZE_24,
  padding: SPACING.SCALE_2,
  [MEDIA_QUERIES.TABLET]: {
    marginTop: SPACING.SCALE_3,
    fontSize: FONT_SIZE.SIZE_18,
    lineHeight: LINE_HEIGHT.SIZE_27,
    padding: SPACING.SCALE_3,
  },
})

const FieldCompany = ({ results, onSearchClick, progress, searchTerm }) => {
  const { values, validateForm } = useFormContext()
  return (
    <FieldWrapper name="add-company">
      <FieldInput
        name="companyName"
        label="Search for a company as the source of foreign equity"
        bigLegend={true}
        data-test="company-name"
        type="search"
        required="Enter company name"
        validate={[
          validateMinLength(COMPANY_NAME_MIN_LENGTH),
          validateMaxLength(COMPANY_NAME_MAX_LENGTH),
        ]}
      />
      <FormActions>
        <Button
          onClick={(e) => {
            e.preventDefault()
            const validationErrors = validateForm()
            if (isEmpty(validationErrors)) {
              onSearchClick(values.companyName)
            }
          }}
        >
          Search
        </Button>
      </FormActions>
      {results && (
        <>
          <article>
            <StyledHeader>
              <StyledHeading>
                <StyledCount>{results.length}</StyledCount>{' '}
                {pluralize('company', results.length)} matching{' '}
                <StyledSearchTerm>{searchTerm}</StyledSearchTerm>
              </StyledHeading>
            </StyledHeader>
            {results.length > 0 && (
              <LoadingBox loading={progress}>
                <EntityList
                  entities={results}
                  entityRenderer={CompanyItemRenderer}
                />
              </LoadingBox>
            )}
          </article>
          {results.length === 0 && !progress && (
            <StyledParagraph>
              If you can't find the company you're looking for,{' '}
              <AccessibleLink
                href={urls.companies.create()}
                aria-label="Add a new company"
              >
                add a new company.{' '}
              </AccessibleLink>
              Unfortunately you will lose your progress.
            </StyledParagraph>
          )}
        </>
      )}
    </FieldWrapper>
  )
}

export default FieldCompany

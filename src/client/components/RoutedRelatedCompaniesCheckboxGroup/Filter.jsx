import React from 'react'
import { Details, Paragraph } from 'govuk-react'
import { FONT_SIZE } from '@govuk-react/constants'
import styled from 'styled-components'
import {
  INCLUDE_RELATED_COMPANIES,
  INCLUDE_RELATED_COMPANIES_DISABLED_SUBSIDIARY,
} from '../../../apps/investments/client/projects/constants'
import { RelatedCompaniesCountResource } from '../Resource'
import { FilterToggleSection } from '../ToggleSection'

import RoutedCheckboxGroupField from '../RoutedCheckboxGroupField'

const SUBSIDIARIES_LIMITED_LABEL =
  'Due to the large number of related companies in this  tree, we can only show projects from parent companies.'

const StyledParagraph = styled(Paragraph)`
  font-size: ${FONT_SIZE.SIZE_16};
`
const StyledDetails = styled(Details)`
  margin-bottom: 0;
  span {
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

const RoutedRelatedCompaniesCheckboxGroup = ({ company, selectedOptions }) => (
  <>
    {company.dunsNumber && (
      <RelatedCompaniesCountResource id={company.id}>
        {(count) => (
          <FilterToggleSection
            id="ProjectCollection.include-related-companies-filters"
            label="Related companies"
            isOpen={true}
          >
            <RoutedCheckboxGroupField
              legend="Include related companies"
              name="include_related_companies"
              qsParam="include_related_companies"
              options={
                count.reducedTree
                  ? INCLUDE_RELATED_COMPANIES_DISABLED_SUBSIDIARY
                  : INCLUDE_RELATED_COMPANIES
              }
              selectedOptions={selectedOptions}
              data-test="include-related-companies-filter"
              aria-description={
                count.reducedTree ? SUBSIDIARIES_LIMITED_LABEL : undefined
              }
            />
            {count.reducedTree && (
              <StyledDetails summary="Why can't I filter by subsidiary companies?">
                <StyledParagraph>{SUBSIDIARIES_LIMITED_LABEL}</StyledParagraph>
              </StyledDetails>
            )}
          </FilterToggleSection>
        )}
      </RelatedCompaniesCountResource>
    )}
  </>
)

export default RoutedRelatedCompaniesCheckboxGroup

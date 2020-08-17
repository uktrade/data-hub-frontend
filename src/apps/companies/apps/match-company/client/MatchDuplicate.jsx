import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import Link from '@govuk-react/link'
import ListItem from '@govuk-react/list-item'
import { H4 } from '@govuk-react/heading'
import styled from 'styled-components'
import Button from '@govuk-react/button'
import { ErrorSummary, UnorderedList } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { FormStateful, FormActions } from '../../../../../client/components'

import urls from '../../../../../lib/urls'

// TODO: Reset all styles to defaults for HTML within react-slot.
const StyledList = styled(UnorderedList)`
  list-style-type: initial;
  margin-bottom: ${SPACING.SCALE_6};
`

async function onFormSubmit({ company, dnbCompany, csrfToken }) {
  await axios.post(
    `${urls.companies.match.merge(company.id)}?_csrf=${csrfToken}`,
    {
      dnbCompany,
    }
  )
  return urls.companies.detail(company.id)
}

function MatchDuplicate({ company, dnbCompany, csrfToken }) {
  return (
    <FormStateful
      onSubmit={() => onFormSubmit({ company, dnbCompany, csrfToken })}
    >
      {({ submissionError }) => (
        <>
          {submissionError && (
            <ErrorSummary
              heading="There was an error merging this company"
              description={submissionError.message}
              errors={[]}
            />
          )}

          <p>
            This can happen when there are duplicate company records in Data
            Hub. To resolve this, you can ask the Support Team to merge these
            duplicates into one record.
          </p>

          <H4 as="h2">Requesting records merge will:</H4>
          <StyledList>
            <ListItem>
              send a request to the Support Team to merge these records
            </ListItem>
            <ListItem>
              preserve all recorded activity (interactions, OMIS Orders and
              Investment Projects) and contacts from BOTH records and link them
              to the merged record
            </ListItem>
            <ListItem>
              ensure the business details are automatically updated in the
              future
            </ListItem>
          </StyledList>
          <FormActions>
            <Button>Request merge</Button>
            <Link href={urls.companies.match.index(company.id)}>Back</Link>
          </FormActions>
        </>
      )}
    </FormStateful>
  )
}

MatchDuplicate.props = {
  company: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  dnbCompany: PropTypes.shape({
    primary_name: PropTypes.string,
    duns_number: PropTypes.string,
    datahub_company_id: PropTypes.string,
  }).isRequired,
}

export default MatchDuplicate

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import axios from 'axios'
import { H4 } from '@govuk-react/heading'
import UnorderedList from '@govuk-react/unordered-list'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import ListItem from '@govuk-react/list-item'
import InsetText from '@govuk-react/inset-text'
import { SPACING } from '@govuk-react/constants'
import ErrorSummary from '@govuk-react/error-summary'

import { Form, FormActions, SummaryList } from 'data-hub-components'

const StyledRoot = styled('div')`
  h2:not(:first-child) {
    margin-top: ${SPACING.SCALE_6};
  }
`

// TODO: Reset all styles to defaults for HTML within react-slot.
const StyledList = styled(UnorderedList)`
  list-style-type: initial;
  margin-bottom: ${SPACING.SCALE_6};
`

async function onMatchSubmit({ dnbCompany, urls, csrfToken }) {
  await axios.post(`${urls.matchConfirmation}?_csrf=${csrfToken}`, {
    dnbCompany,
  })
  return urls.companyDetail
}

function MatchConfirmation({ company, dnbCompany, urls, csrfToken }) {
  return (
    <StyledRoot>
      <Form onSubmit={() => onMatchSubmit({ dnbCompany, urls, csrfToken })}>
        {({ submissionError }) => (
          <>
            {submissionError && (
              <ErrorSummary
                heading="There was an error matching this company"
                description={submissionError.message}
                errors={[]}
              />
            )}

            <H4 as="h2">
              Confirm you want to update this Data Hub company record
            </H4>
            <InsetText>
              <SummaryList
                rows={[
                  { label: 'Company name', value: company.name },
                  {
                    label: 'Located at',
                    value: company.address.join(', '),
                  },
                ]}
              />
            </InsetText>

            <H4 as="h2">With this verified third party company information</H4>
            <InsetText>
              <SummaryList
                rows={[
                  {
                    label: 'Company name',
                    value: dnbCompany.primary_name,
                  },
                  {
                    label: 'Located at',
                    value: dnbCompany.address.join(', '),
                  },
                ]}
              />
            </InsetText>

            <H4 as="h2">What happens next</H4>
            <StyledList>
              <ListItem>
                This will send a request to the Support Team to update the
                business details for this company record, including any future
                changes to this information.
              </ListItem>
              <ListItem>
                This will NOT change any recorded activity (Interactions, OMIS
                orders or Investments projects) for this company record.
              </ListItem>
            </StyledList>
            <FormActions>
              <Button>Send update request</Button>
              <Link href={urls.match}>Back</Link>
            </FormActions>
          </>
        )}
      </Form>
    </StyledRoot>
  )
}

MatchConfirmation.props = {
  company: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dnbCompany: PropTypes.shape({
    primary_name: PropTypes.string,
    duns_number: PropTypes.string,
    address: PropTypes.arrayOf(PropTypes.string),
    registered_address: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  urls: PropTypes.shape({
    companyDetail: PropTypes.string,
    match: PropTypes.string,
    matchConfirmation: PropTypes.string,
  }).isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default MatchConfirmation

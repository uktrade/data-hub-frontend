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
import urls from '../../../../../lib/urls'
import MatchDuplicate from './MatchDuplicate'

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

async function onMatchSubmit({ company, dnbCompany, csrfToken }) {
  await axios.post(
    `${urls.companies.match.confirmation(
      company.id,
      dnbCompany.duns_number
    )}?_csrf=${csrfToken}`,
    {
      dnbCompany,
    }
  )
  return urls.companies.detail(company.id)
}

function MatchConfirmation({
  dnbCompanyIsMatched,
  company,
  dnbCompany,
  csrfToken,
}) {
  if (dnbCompanyIsMatched) {
    return <MatchDuplicate company={company} dnbCompany={dnbCompany} />
  }

  return (
    <StyledRoot>
      <Form onSubmit={() => onMatchSubmit({ company, dnbCompany, csrfToken })}>
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
              <Link href={urls.companies.match.index(company.id)}>Back</Link>
            </FormActions>
          </>
        )}
      </Form>
    </StyledRoot>
  )
}

MatchConfirmation.props = {
  dnbCompanyIsMatched: PropTypes.bool.isRequired,
  company: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  dnbCompany: PropTypes.shape({
    primary_name: PropTypes.string,
    duns_number: PropTypes.string,
    address: PropTypes.arrayOf(PropTypes.string),
    registered_address: PropTypes.arrayOf(PropTypes.string),
    datahub_company_id: PropTypes.string,
  }).isRequired,
  csrfToken: PropTypes.string.isRequired,
}

export default MatchConfirmation

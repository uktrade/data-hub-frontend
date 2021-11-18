import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H4 } from '@govuk-react/heading'
import UnorderedList from '@govuk-react/unordered-list'
import ListItem from '@govuk-react/list-item'
import InsetText from '@govuk-react/inset-text'
import { SPACING } from '@govuk-react/constants'
import Details from '@govuk-react/details'

import { SummaryList } from '../../../../../client/components'
import TaskForm from '../../../../../client/components/Task/Form'
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

function MatchConfirmation({
  dnbCompanyIsMatched,
  company,
  dnbCompany,
  csrfToken,
}) {
  if (dnbCompanyIsMatched) {
    return (
      <MatchDuplicate
        company={company}
        dnbCompany={dnbCompany}
        csrfToken={csrfToken}
      />
    )
  }

  return (
    <StyledRoot>
      <TaskForm
        id="match-confirmation-form"
        submissionTaskName="Match confirmation"
        analyticsFormName="match-confirmation-form"
        redirectTo={(company) => urls.companies.detail(company.id)}
        flashMessage={() => [
          'Business details verified.',
          'Thanks for helping to improve the quality of records on Data Hub!',
        ]}
        transformPayload={() => ({
          company,
          dnbCompany,
          csrfToken,
        })}
        submitButtonLabel="Verify"
        actionLinks={[
          { href: urls.companies.match.index(company.id), children: 'Back' },
        ]}
      >
        {() => (
          <>
            <H4 as="h2">Data Hub business details (un-verified)</H4>
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

            <H4 as="h2">Data Hub business details (after verification)</H4>
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

            <Details summary="Why can't I edit these details">
              These business details are from trusted third-party suppliers of
              verified company records. Being editable would make them less
              reliable. If you think they're wrong, go back and select "I can't
              find what I'm looking for".
            </Details>

            <H4 as="h2">Verifying business details will:</H4>
            <StyledList>
              <ListItem>
                NOT change any recorded activity (interactions, OMIS orders or
                Investment projects)
              </ListItem>
              <ListItem>
                ensure these business details are updated automatically in the
                future
              </ListItem>
            </StyledList>
          </>
        )}
      </TaskForm>
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

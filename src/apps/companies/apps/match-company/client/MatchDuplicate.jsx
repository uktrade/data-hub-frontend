import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@govuk-react/list-item'
import { H4 } from '@govuk-react/heading'
import styled from 'styled-components'
import { UnorderedList } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import TaskForm from '../../../../../client/components/Form/index.jsx'

import urls from '../../../../../lib/urls'

// TODO: Reset all styles to defaults for HTML within react-slot.
const StyledList = styled(UnorderedList)`
  list-style-type: initial;
  margin-bottom: ${SPACING.SCALE_6};
`

const MatchDuplicate = ({ company, dnbCompany, csrfToken }) => (
  <TaskForm
    id="match-duplicate-form"
    analyticsFormName="matchDuplicate"
    submissionTaskName="Submit merge request"
    transformPayload={() => ({
      company,
      dnbCompany,
      csrfToken,
    })}
    submitButtonLabel="Request merge"
    cancelRedirectTo={() => urls.companies.match.index(company.id)}
    cancelButtonLabel="Back"
    flashMessage={() =>
      'Company merge requested. Thanks for keeping Data Hub running smoothly.'
    }
    redirectTo={(company) => urls.companies.detail(company.id)}
  >
    <>
      <p>
        This can happen when there are duplicate company records in Data Hub. To
        resolve this, you can ask the Support Team to merge these duplicates
        into one record.
      </p>

      <H4 as="h2">Requesting records merge will:</H4>
      <StyledList>
        <ListItem>
          send a request to the Support Team to merge these records
        </ListItem>
        <ListItem>
          preserve all recorded activity (interactions, OMIS Orders and
          Investment Projects) and contacts from BOTH records and link them to
          the merged record
        </ListItem>
        <ListItem>
          ensure the business details are automatically updated in the future
        </ListItem>
      </StyledList>
    </>
  </TaskForm>
)

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

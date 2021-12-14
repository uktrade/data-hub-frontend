import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'

import {
  Main,
  FormActions,
  FormStateful,
} from '../../../../../client/components'

import OpportunityResource from '../../../../../client/components/Resource/Opportunity'
import FieldOpportunityStatuses from '../../../../../client/components/Form/elements/FieldOpportunityStatuses'

const OpportunityChangeStatusForm = ({ opportunityId }) => {
  const opportunityUrl = urls.investments.opportunities.details(opportunityId)

  return (
    <OpportunityResource id={opportunityId}>
      {({ name, status }) => (
        <>
          <LocalHeader
            breadcrumbs={[
              { link: urls.dashboard(), text: 'Home' },
              { link: urls.investments.index(), text: 'Investments' },
              {
                link: urls.investments.opportunities.index(),
                text: 'UK opportunities',
              },
              {
                link: opportunityUrl,
                text: name,
              },
              { text: 'Change status' },
            ]}
            heading="Change opportunity status"
          />
          <Main>
            <FormStateful
              showErrorSummary={true}
              onSubmit={async (values) => {
                await axios.patch(
                  `/api-proxy/v4/large-capital-opportunity/${opportunityId}`,
                  {
                    status: values.status,
                  }
                )
                return opportunityUrl
              }}
            >
              <FieldOpportunityStatuses
                name="status"
                initialValue={status.id}
              />
              <FormActions>
                <Button data-test="edit-button">Save</Button>
                <Link href={opportunityUrl}>Cancel</Link>
              </FormActions>
            </FormStateful>
          </Main>
        </>
      )}
    </OpportunityResource>
  )
}

OpportunityChangeStatusForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}

export default OpportunityChangeStatusForm

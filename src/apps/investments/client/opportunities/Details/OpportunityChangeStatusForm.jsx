import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'

import { Main } from '../../../../../client/components'

import OpportunityResource from '../../../../../client/components/Resource/Opportunity'
import FieldOpportunityStatuses from '../../../../../client/components/Form/elements/FieldOpportunityStatuses'

import Form from '../../../../../client/components/Form'

import { TASK_SAVE_OPPORTUNITY_STATUS } from './state'

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
            <Form
              id="opportunity-change-status"
              analyticsFormName="opportunityChangeStatus"
              submissionTaskName={TASK_SAVE_OPPORTUNITY_STATUS}
              transformPayload={(values) => ({
                values,
                opportunityId,
              })}
              redirectTo={() => opportunityUrl}
              cancelRedirectTo={() => opportunityUrl}
            >
              <FieldOpportunityStatuses
                name="status"
                initialValue={status.id}
              />
            </Form>
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

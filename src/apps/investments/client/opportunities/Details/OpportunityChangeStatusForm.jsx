import React from 'react'
import PropTypes from 'prop-types'

import urls from '../../../../../lib/urls'
import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'

import { Main } from '../../../../../client/components'

import OpportunityResource from '../../../../../client/components/Resource/Opportunity'
import FieldOpportunityStatuses from '../../../../../client/components/Form/elements/FieldOpportunityStatuses'

import TaskForm from '../../../../../client/components/Task/Form'

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
            <TaskForm
              id="opportunity-change-status"
              analyticsFormName="opportunityChangeStatus"
              submissionTaskName={TASK_SAVE_OPPORTUNITY_STATUS}
              transformPayload={(values) => ({
                values,
                opportunityId,
              })}
              redirectTo={() => opportunityUrl}
              actionLinks={[
                {
                  href: opportunityUrl,
                  children: 'Cancel',
                },
              ]}
            >
              <FieldOpportunityStatuses
                name="status"
                initialValue={status.id}
              />
            </TaskForm>
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

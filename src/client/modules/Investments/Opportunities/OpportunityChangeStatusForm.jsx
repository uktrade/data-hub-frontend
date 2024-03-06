import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import urls from '../../../../lib/urls'
import { DefaultLayout, Form } from '../../../components'
import { OpportunityResource } from '../../../components/Resource'
import FieldOpportunityStatuses from '../../../components/Form/elements/FieldOpportunityStatuses'
import { TASK_SAVE_OPPORTUNITY_STATUS } from './state'

const OpportunityChangeStatusForm = () => {
  const { opportunityId } = useParams()
  const opportunityUrl = urls.investments.opportunities.details(opportunityId)

  return (
    <OpportunityResource id={opportunityId}>
      {({ name, status }) => (
        <DefaultLayout
          breadcrumbs={[
            { link: urls.dashboard.index(), text: 'Home' },
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
          pageTitle={`Investments`}
        >
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
            <FieldOpportunityStatuses name="status" initialValue={status.id} />
          </Form>
        </DefaultLayout>
      )}
    </OpportunityResource>
  )
}

export default OpportunityChangeStatusForm

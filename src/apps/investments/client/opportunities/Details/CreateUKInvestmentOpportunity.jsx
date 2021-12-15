import React from 'react'

import { ID, TASK_CREATE_INVESTMENT_OPPORTUNITY } from './state'
import { FieldInput, Main } from '../../../../../client/components'
import TaskForm from '../../../../../client/components/Task/Form'

import urls from '../../../../../lib/urls'

function CreateUKInvestmentOpportunity() {
  return (
    <Main>
      <TaskForm
        id={ID}
        analyticsFormName="createUKInvestmentOpportunity"
        submissionTaskName={TASK_CREATE_INVESTMENT_OPPORTUNITY}
        transformPayload={(name) => ({
          name,
        })}
        redirectTo={(result) => urls.investments.opportunities.details(result)}
        actionLinks={[
          {
            href: urls.investments.opportunities.index(),
            children: 'Cancel',
          },
        ]}
      >
        <FieldInput
          name="name"
          label="Opportunity name"
          type="text"
          spellcheck="false"
        />
      </TaskForm>
    </Main>
  )
}

export default CreateUKInvestmentOpportunity

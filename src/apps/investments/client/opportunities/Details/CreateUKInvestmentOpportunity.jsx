import React from 'react'

import { ID, TASK_CREATE_INVESTMENT_OPPORTUNITY } from './state'
import { FieldInput, Main } from '../../../../../client/components'
import TaskForm from '../../../../../client/components/Form'

import urls from '../../../../../lib/urls'

const CreateUKInvestmentOpportunity = () => (
  <Main>
    <TaskForm
      id={ID}
      analyticsFormName="createUKInvestmentOpportunity"
      submissionTaskName={TASK_CREATE_INVESTMENT_OPPORTUNITY}
      redirectTo={(newOpportunityId) =>
        urls.investments.opportunities.details(newOpportunityId)
      }
      cancelRedirectTo={() => urls.investments.opportunities.index()}
    >
      <FieldInput
        name="name"
        label="Opportunity name"
        type="text"
        spellcheck="false"
        required="Enter an opportunity name"
      />
    </TaskForm>
  </Main>
)

export default CreateUKInvestmentOpportunity

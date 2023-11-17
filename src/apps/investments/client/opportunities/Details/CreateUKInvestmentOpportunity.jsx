import React from 'react'

import { ID, TASK_CREATE_INVESTMENT_OPPORTUNITY } from './state'
import { DefaultLayout, FieldInput } from '../../../../../client/components'
import Form from '../../../../../client/components/Form'

import urls from '../../../../../lib/urls'

const CreateUKInvestmentOpportunity = () => (
  <DefaultLayout
    pageTitle="Create UK investment opportunity"
    heading="Create UK investment opportunity"
    breadcrumbs={[
      { link: urls.dashboard.index(), text: 'Home' },
      { link: urls.investments.index(), text: 'Investments' },
      { text: 'Create UK investment opportunity' },
    ]}
  >
    <Form
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
    </Form>
  </DefaultLayout>
)

export default CreateUKInvestmentOpportunity

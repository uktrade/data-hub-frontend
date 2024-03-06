import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import {
  DefaultLayout,
  FieldAdvisersTypeahead,
  FieldDate,
  FieldInput,
  Form,
  FormLayout,
} from '../../../../components'
import { InvestmentResource } from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import { transformPropositionForAPI } from './transformers'
import { TASK_CREATE_INVESTMENT_PROPOSITION } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import { buildProjectBreadcrumbs } from '../../utils'
import InvestmentName from '../InvestmentName'

const CreateProposition = () => {
  const { projectId } = useParams()
  return (
    <DefaultLayout
      heading={
        <>
          Add proposition for <InvestmentName id={projectId} />
        </>
      }
      pageTitle={
        <>
          Add proposition for <InvestmentName id={projectId} /> -{' '}
          <InvestmentName id={projectId} /> - Projects - Investments
        </>
      }
      breadcrumbs={buildProjectBreadcrumbs([
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        {
          text: 'Add proposition',
        },
      ])}
    >
      <InvestmentResource id={projectId}>
        {() => (
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Form
              id="create-investment-proposition"
              analyticsFormName="createInvestmentProposition"
              cancelRedirectTo={() =>
                urls.investments.projects.propositions(projectId)
              }
              flashMessage={() => 'Proposition created'}
              submitButtonLabel="Add proposition"
              submissionTaskName={TASK_CREATE_INVESTMENT_PROPOSITION}
              redirectTo={() =>
                urls.investments.projects.propositions(projectId)
              }
              transformPayload={(values) =>
                transformPropositionForAPI({
                  projectId,
                  values,
                })
              }
            >
              <FieldInput
                label="Proposition name"
                name="proposition_name"
                type="text"
                required="Enter a name"
              />
              <FieldInput
                label="Scope"
                name="proposition_scope"
                type="text"
                required="Enter a scope"
              />
              <FieldAdvisersTypeahead
                name="proposition_assignee"
                label="Assigned to"
                required="Select an adviser"
                isMulti={false}
              />
              <FieldDate
                name="proposition_deadline"
                label="Deadline"
                required="Enter a valid date"
              />
            </Form>
          </FormLayout>
        )}
      </InvestmentResource>
    </DefaultLayout>
  )
}

export default CreateProposition

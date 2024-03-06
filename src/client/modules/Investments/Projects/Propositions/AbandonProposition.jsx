import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import {
  DefaultLayout,
  FieldTextarea,
  Form,
  FormLayout,
} from '../../../../components'
import {
  InvestmentResource,
  PropositionResource,
} from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import {
  buildPropositionUrl,
  transformAbandonedPropositionForAPI,
} from './transformers'
import { TASK_ABANDON_INVESTMENT_PROPOSITION } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import { RED } from '../../../../utils/colours'
import { buildProjectBreadcrumbs } from '../../utils'

const AbandonProposition = () => {
  const { propositionId, projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <PropositionResource id={buildPropositionUrl(propositionId, projectId)}>
          {(proposition) => (
            <DefaultLayout
              heading={`Abandon proposition ${proposition.name}`}
              pageTitle={`Abandon proposition ${proposition.name} - ${project.name} - Projects - Investments`}
              breadcrumbs={buildProjectBreadcrumbs([
                {
                  link: urls.investments.projects.details(project.id),
                  text: project.name,
                },
                {
                  text: 'Abandon proposition',
                },
              ])}
            >
              <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
                <Form
                  id="abandon-investment-proposition"
                  analyticsFormName="abandonInvestmentProposition"
                  cancelRedirectTo={() =>
                    urls.investments.projects.propositions(projectId)
                  }
                  flashMessage={() => 'Proposition abandoned'}
                  submitButtonLabel="Abandon proposition"
                  submitButtonColour={RED}
                  submissionTaskName={TASK_ABANDON_INVESTMENT_PROPOSITION}
                  redirectTo={() =>
                    urls.investments.projects.propositions(projectId)
                  }
                  transformPayload={(values) =>
                    transformAbandonedPropositionForAPI({
                      projectId,
                      propositionId,
                      values,
                    })
                  }
                >
                  <FieldTextarea
                    type="text"
                    name="reason"
                    label="Reason"
                    hint="Add the reason you're abandoning this proposition"
                    required="Enter the reason the proposition is being abandoned"
                  />
                </Form>
              </FormLayout>
            </DefaultLayout>
          )}
        </PropositionResource>
      )}
    </InvestmentResource>
  )
}

export default AbandonProposition

import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldTextarea,
  Form,
  FormLayout,
  LocalHeader,
  Main,
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

const AbandonProposition = ({ propositionId, investmentProjectId }) => (
  <InvestmentResource id={investmentProjectId}>
    {(project) => (
      <PropositionResource
        id={buildPropositionUrl(propositionId, investmentProjectId)}
      >
        {(proposition) => (
          <>
            <LocalHeader
              heading={`Abandon proposition ${proposition.name}`}
              breadcrumbs={buildProjectBreadcrumbs([
                {
                  link: urls.investments.projects.details(project.id),
                  text: project.name,
                },
                {
                  text: 'Abandon proposition',
                },
              ])}
            />
            <Main>
              <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
                <Form
                  id="abandon-investment-proposition"
                  analyticsFormName="abandonInvestmentProposition"
                  cancelRedirectTo={() =>
                    urls.investments.projects.propositions(investmentProjectId)
                  }
                  flashMessage={() => 'Proposition abandoned'}
                  submitButtonLabel="Abandon proposition"
                  submitButtonColour={RED}
                  submissionTaskName={TASK_ABANDON_INVESTMENT_PROPOSITION}
                  redirectTo={() =>
                    urls.investments.projects.propositions(investmentProjectId)
                  }
                  transformPayload={(values) =>
                    transformAbandonedPropositionForAPI({
                      investmentProjectId,
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
            </Main>
          </>
        )}
      </PropositionResource>
    )}
  </InvestmentResource>
)

AbandonProposition.propTypes = {
  investmentProjectId: PropTypes.string.isRequired,
  propositionId: PropTypes.string.isRequired,
}

export default AbandonProposition

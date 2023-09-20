import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldAdvisersTypeahead,
  FieldDate,
  FieldInput,
  Form,
  FormLayout,
  LocalHeader,
  Main,
} from '../../../../components'
import { InvestmentResource } from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import { transformPropositionForAPI } from './transformers'
import { TASK_CREATE_INVESTMENT_PROPOSITION } from './state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import { buildProjectBreadcrumbs } from '../../utils'

const CreateProposition = ({ projectId }) => (
  <InvestmentResource id={projectId}>
    {(project) => (
      <>
        <LocalHeader
          heading={`Add proposition for ${project.name}`}
          breadcrumbs={buildProjectBreadcrumbs([
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            {
              text: 'Add proposition',
            },
          ])}
        />
        <Main>
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
        </Main>
      </>
    )}
  </InvestmentResource>
)

CreateProposition.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default CreateProposition

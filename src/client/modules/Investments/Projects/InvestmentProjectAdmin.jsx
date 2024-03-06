import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import { H4, InsetText } from 'govuk-react'
import styled from 'styled-components'
import { SPACING } from '@govuk-react/constants'

import urls from '../../../../lib/urls'
import {
  InvestmentProjectStageResource,
  InvestmentResource,
} from '../../../components/Resource'
import { buildProjectBreadcrumbs } from '../utils'
import { transformObjectToOption } from '../../../../apps/transformers'
import {
  DefaultLayout,
  FieldRadios,
  Form,
  FormLayout,
} from '../../../components'
import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_UPDATE_STAGE } from './state'
import InvestmentName from './InvestmentName'

const StyledP = styled('p')`
  margin-bottom: ${SPACING.SCALE_2};
`

const InvestmentProjectAdmin = () => {
  const { projectId } = useParams()

  return (
    <DefaultLayout
      heading="Change the project stage"
      pageTitle={
        <>
          Admin - <InvestmentName id={projectId} /> - Projects - Investments
        </>
      }
      breadcrumbs={buildProjectBreadcrumbs([
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Admin' },
      ])}
      useReactRouter={false}
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <FormLayout setWidth={FORM_LAYOUT.TWO_THIRDS}>
            <H4 as="h2">Project details</H4>
            <InsetText>
              <p>Project name: {project.name}</p>
              <StyledP>Current stage: {project.stage.name}</StyledP>
            </InsetText>
            <Form
              cancelRedirectTo={() =>
                urls.investments.projects.details(projectId)
              }
              analyticsFormName="investmentProjectAdmin"
              flashMessage={() => 'Project stage saved'}
              id="investmentProjectAdmin"
              redirectTo={() => urls.investments.projects.details(projectId)}
              submissionTaskName={TASK_UPDATE_STAGE}
              transformPayload={(values) => ({ values, projectId })}
            >
              <InvestmentProjectStageResource>
                {(stages) => (
                  <>
                    <H4 as="h2">Change the stage to</H4>
                    <FieldRadios
                      name="projectStageId"
                      required="Select a new stage"
                      options={stages
                        .map((stage) => transformObjectToOption(stage))
                        .filter((stage) => stage.value !== project.stage.id)}
                    />
                  </>
                )}
              </InvestmentProjectStageResource>
            </Form>
          </FormLayout>
        )}
      </InvestmentResource>
    </DefaultLayout>
  )
}

export default InvestmentProjectAdmin

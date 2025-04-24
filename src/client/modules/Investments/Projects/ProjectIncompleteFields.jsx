import React from 'react'
import styled from 'styled-components'
import { ListItem, UnorderedList } from 'govuk-react'
import { kebabCase } from 'lodash'

import urls from '../../../../lib/urls'
import { Form, StatusMessage } from '../../../components'
import {
  getNextStage,
  mapFieldToUrl,
  transformProjectStageForApi,
} from './transformers'
import { TASK_UPDATE_INVESTMENT_PROJECT_STAGE } from './state'
import { INCOMPLETE_FIELDS } from '../../../components/MyInvestmentProjects/constants'
import { BLUE } from '../../../utils/colours'
import { STAGE_ACTIVE, STAGE_VERIFY_WIN, STAGE_WON } from './constants'
import AccessibleLink from '../../../components/Link'

const StyledListItem = styled(ListItem)`
  color: ${BLUE};
  font-weight: bold;
  line-height: 1.5;
`

const StyledP = styled('p')`
  color: ${BLUE};
  font-weight: bold;
  line-height: 1.5;
`

const getIncompleteFields = (incompleteFields) =>
  Object.entries(INCOMPLETE_FIELDS)
    .reduce(
      (newObj, [key, value]) =>
        incompleteFields
          ? incompleteFields.includes(key)
            ? [...newObj, value]
            : newObj
          : newObj,
      []
    )
    .sort()

const checkIfActiveOrVerifyWin = (currentStage, projectId) =>
  currentStage === STAGE_ACTIVE ? (
    <>
      <StyledP>Before you move to the Verify win stage:</StyledP>
      <UnorderedList listStyleType="bullet">
        <StyledListItem key={1}>
          <AccessibleLink
            href={urls.investments.projects.evidence.index(projectId)}
            data-test="upload-evidence-link"
          >
            Upload any evidence documents
          </AccessibleLink>
        </StyledListItem>
      </UnorderedList>
    </>
  ) : currentStage === STAGE_VERIFY_WIN ? (
    <>
      <StyledP>Before you move to the Won stage:</StyledP>
      <UnorderedList listStyleType="bullet">
        <StyledListItem key={1}>
          <AccessibleLink
            href={urls.investments.projects.evidence.index(projectId)}
            data-test="review-evidence-link"
          >
            Review the evidence for this investment project
          </AccessibleLink>
        </StyledListItem>
      </UnorderedList>
    </>
  ) : (
    'You have added all required information to complete this stage.'
  )

const checkIfUserCanMoveToVerifyWin = (project, currentAdviser) =>
  project.stage.name === STAGE_ACTIVE
    ? currentAdviser === project.projectManager.id ||
      currentAdviser === project.projectAssuranceAdviser.id
    : true

const ProjectIncompleteFields = ({
  project,
  currentAdviserId,
  projectStages,
}) =>
  project.stage.name != STAGE_WON &&
  (project.incompleteFields?.length == 0 ? (
    <StatusMessage data-test="move-to-next-stage">
      {checkIfActiveOrVerifyWin(project.stage.name, project.id)}
      {checkIfUserCanMoveToVerifyWin(project, currentAdviserId) ? (
        <Form
          id="edit-project-stage"
          analyticsFormName="editInvestmentProjectStage"
          flashMessage={() =>
            `Investment project moved to ${getNextStage(
              project.stage.name
            )} stage`
          }
          submitButtonLabel={`Move to ${getNextStage(
            project.stage.name
          )} stage`}
          redirectTo={() => urls.investments.projects.details(project.id)}
          submissionTaskName={TASK_UPDATE_INVESTMENT_PROJECT_STAGE}
          transformPayload={(values) =>
            transformProjectStageForApi({
              values,
              project,
              projectStages,
            })
          }
        />
      ) : (
        <>
          <br />
          <StyledP>
            Only the Project Manager or Project Assurance Adviser can move the
            project to the Verify win stage.
          </StyledP>
        </>
      )}
    </StatusMessage>
  ) : (
    <StatusMessage data-test="project-incomplete-fields">
      To move to the {getNextStage(project.stage.name)} stage complete the
      following:
      <UnorderedList listStyleType="bullet">
        {getIncompleteFields(project.incompleteFields).map((step, i) => (
          <StyledListItem key={i}>
            <AccessibleLink
              href={mapFieldToUrl(step, project.id)}
              data-test={`${kebabCase(step)}-link`}
            >
              {step}
            </AccessibleLink>
          </StyledListItem>
        ))}
      </UnorderedList>
    </StatusMessage>
  ))

export default ProjectIncompleteFields

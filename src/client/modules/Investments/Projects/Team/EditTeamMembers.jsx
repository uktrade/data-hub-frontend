import React from 'react'
import { useParams } from 'react-router-dom'

import {
  FieldAdvisersTypeahead,
  FieldInput,
  Form,
} from '../../../../components'
import urls from '../../../../../lib/urls'
import FieldAddAnother from '../../../../components/Form/elements/FieldAddAnother/index.jsx'
import { TASK_EDIT_PROJECT_TEAM_MEMBERS } from './state'
import {
  transformTeamMembersForFieldAddAnother,
  transformValuesToArray,
} from './transformers'
import { InvestmentResource } from '../../../../components/Resource'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew.jsx'
import InvestmentName from '../InvestmentName.jsx'

const EditTeamMembers = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        {
          link: urls.investments.projects.team(projectId),
          text: 'Project team',
        },
        { text: 'Team members' },
      ]}
      pageTitle="Team members"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <>
            <Form
              id="project-edit-team-members"
              analyticsFormName="projectEditTeamMembers"
              cancelButtonLabel="Back"
              cancelRedirectTo={() =>
                urls.investments.projects.team(project.id)
              }
              initialValues={transformTeamMembersForFieldAddAnother(
                project.teamMembers
              )}
              submissionTaskName={TASK_EDIT_PROJECT_TEAM_MEMBERS}
              transformPayload={(values) => ({
                teamMembers: transformValuesToArray(values),
                id: project.id,
              })}
              flashMessage={() => 'Investment details updated'}
              redirectTo={() => urls.investments.projects.team(project.id)}
            >
              <FieldAddAnother
                name="edit-team-members"
                itemName="team member"
                dataTestPrefix="team-member-field-"
                legend="Assign project specialist and team members"
                initialChildGroupCount={
                  project.teamMembers.length === 0
                    ? 1
                    : project.teamMembers.length
                }
              >
                {({ groupIndex }) => (
                  <>
                    <FieldAdvisersTypeahead
                      name={`adviser_${groupIndex}`}
                      label="Team member"
                      placeholder="Search team member"
                      required="Select at least one adviser"
                      aria-label="Select an adviser"
                    />
                    <FieldInput
                      name={`role_${groupIndex}`}
                      type="text"
                      label="Role"
                      required="Enter a role for the adviser"
                    />
                  </>
                )}
              </FieldAddAnother>
            </Form>
          </>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default EditTeamMembers

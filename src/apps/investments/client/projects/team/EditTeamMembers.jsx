import React from 'react'

import {
  FieldAdvisersTypeahead,
  FieldInput,
  Form,
} from '../../../../../client/components'
import urls from '../../../../../lib/urls'
import FieldAddAnother from '../../../../../client/components/Form/elements/FieldAddAnother/index.jsx'
import { TASK_EDIT_PROJECT_TEAM_MEMBERS } from './state'
import {
  transformTeamMembersForFieldAddAnother,
  transformValuesToArray,
} from './transformers'

export const EditTeamMembers = ({ id, teamMembers }) => (
  <Form
    id="project-edit-team-members"
    analyticsFormName="projectEditTeamMembers"
    cancelButtonLabel="Return without saving"
    cancelRedirectTo={() => urls.investments.projects.team(id)}
    initialValues={transformTeamMembersForFieldAddAnother(teamMembers)}
    submissionTaskName={TASK_EDIT_PROJECT_TEAM_MEMBERS}
    submitButtonLabel="Save and return"
    transformPayload={(values) => ({
      teamMembers: transformValuesToArray(values),
      id,
    })}
    flashMessage={() => 'Changes saved'}
    redirectTo={() => urls.investments.projects.team(id)}
  >
    <FieldAddAnother
      name="edit-team-members"
      itemName="team member"
      dataTestPrefix="team-member-field-"
      legend="Assign project specialist and team members"
      initialChildGroupCount={teamMembers.length === 0 ? 1 : teamMembers.length}
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
)

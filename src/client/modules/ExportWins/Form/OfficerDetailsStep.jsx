import React from 'react'
import { H3 } from '@govuk-react/heading'

import HQTeamRegionOrPost from '../../../components/Resource/HQTeamRegionOrPost'
import TeamType from '../../../components/Resource/TeamType'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step, FieldAdvisersTypeahead } from '../../../components'
import { idNamesToValueLabels } from '../../../utils'
import * as validators from './validators'
import urls from '../../../../lib/urls'
import { steps } from './constants'

const OfficerDetailsStep = ({
  companyId,
  exportId,
  exportWinId,
  isEditing,
}) => {
  const { values } = useFormContext()
  return (
    <Step
      name={steps.OFFICER_DETAILS}
      cancelUrl={
        exportId
          ? urls.exportPipeline.details(exportId)
          : exportWinId
            ? urls.companies.exportWins.editSummary(companyId, exportWinId)
            : companyId
              ? urls.companies.overview.index(companyId)
              : null
      }
    >
      <H3 data-test="step-heading">Officer details</H3>
      {!isEditing && (
        <FieldAdvisersTypeahead
          name="lead_officer"
          label="Lead officer name"
          required="Enter a lead officer"
          validate={validators.validateLeadOfficer}
        />
      )}
      <TeamType.FieldTypeahead
        name="team_type"
        id="team-type"
        fullWidth={true}
        label="Team type"
        required="Select a team type"
      />
      {values.team_type && (
        // Should a user choose a team type, then choose a HQ team, region or post
        // then change their mind and change the team type for a second time we
        // want the component below to rerender and display 'Start typing'. We don't
        // want the previous selection displayed after they've changed the team type.
        // To ensure this happens we've added a key prop and set it to the team type
        // id, when the id changes the component updates.
        <HQTeamRegionOrPost.FieldTypeahead
          key={values.team_type.value}
          name="hq_team"
          id={`officer-hq-team-region-or-post`}
          fullWidth={true}
          payload={{ team_type: values.team_type.value }}
          resultToOptions={(result) =>
            idNamesToValueLabels(result.filter((team) => !team.disabledOn))
          }
          label="HQ team, region or post"
          required="Select HQ team, region or post"
        />
      )}
      <FieldAdvisersTypeahead
        name="team_members"
        label="Team members (optional)"
        hint="These are your secondary contacts, such as your manager or direct team,
               they will not be credited for this win. You can add up to 5 team members."
        validate={[
          validators.validateTeamMembers,
          validators.validateTeamMembersAreNotContributors,
          validators.validateTeamMembersAndLeadOfficer,
        ]}
        isMulti={true}
      />
    </Step>
  )
}

export default OfficerDetailsStep

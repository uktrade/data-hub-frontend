import React from 'react'
import { useLocation } from 'react-router-dom'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import * as validators from './validators'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import urls from '../../../../lib/urls'
import { steps } from './constants'
import {
  TeamTypeResource,
  HQTeamRegionOrPostsResource,
} from '../../../components/Resource'
import {
  Step,
  FieldAdvisersTypeahead,
  FieldTypeahead,
} from '../../../components'

const OfficerDetailsStep = () => {
  const { values } = useFormContext()
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)

  return (
    <Step
      name={steps.OFFICER_DETAILS}
      cancelUrl={
        queryParams.export
          ? urls.exportPipeline.details(queryParams.export)
          : queryParams.companywin
            ? urls.companies.exportWins.checkBeforeSending(
                queryParams.companywin
              )
            : queryParams.company
              ? urls.companies.overview.index(queryParams.company)
              : null
      }
    >
      <H3 data-test="step-heading">Officer details</H3>
      <FieldAdvisersTypeahead
        name="lead_officer"
        label="Lead officer name"
        required="Enter a lead officer"
      />
      <ResourceOptionsField
        name="team_type"
        id="team-type"
        resource={TeamTypeResource}
        field={FieldTypeahead}
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
        <ResourceOptionsField
          key={values.team_type.value}
          name="hq_team"
          id={`officer-hq-team-region-or-post`}
          resource={HQTeamRegionOrPostsResource}
          field={FieldTypeahead}
          fullWidth={true}
          payload={{ team_type: values.team_type.value }}
          label="HQ team, region or post"
          required="Select HQ team, region or post"
        />
      )}
      <FieldAdvisersTypeahead
        name="team_members"
        label="Team members (optional)"
        hint="You can add up to 5 team members. They will not be credited for the win but will be notified when this win is updated."
        validate={validators.validateTeamMembers}
        isMulti={true}
      />
    </Step>
  )
}

export default OfficerDetailsStep

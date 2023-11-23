import React from 'react'
import { useLocation } from 'react-router-dom'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import * as validators from '../../../../client/components/Form/validators'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import urls from '../../../../lib/urls'
import {
  ExportResource,
  TeamTypeResource,
  HQTeamRegionOrPostsResource,
} from '../../../components/Resource'
import {
  Step,
  Wrap,
  FieldAdvisersTypeahead,
  FieldSelect,
} from '../../../components'
import { steps } from './constants'

const OfficerDetailsStep = () => {
  const { values } = useFormContext()
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)

  // 1. If queryParams.export is defined then the user is coming from an Export Project,
  //    fields within the project are used to prepopulate the Export Wins form.
  // 2. If queryParams.exportwin is defined then we're editing an existing Export Win
  // 3. If both of the above are undefined then the user is adding a new export win from scratch.

  return (
    <Step
      name={steps.OFFICER_DETAILS}
      cancelUrl={
        queryParams.export
          ? urls.exportPipeline.details(queryParams.export)
          : queryParams.company
          ? urls.companies.overview.index(queryParams.company)
          : null
      }
    >
      <H3>Officer details</H3>
      <Wrap
        with={ExportResource}
        when={queryParams.export}
        props={{ id: queryParams.export }}
      >
        {(exportProject) => (
          <>
            <FieldAdvisersTypeahead
              name="owner"
              label="Owner name"
              required="Enter an owner"
              initialValue={
                exportProject
                  ? {
                      value: exportProject.owner.id,
                      label: exportProject.owner.name,
                    }
                  : null
              }
            />
            <ResourceOptionsField
              id={`officer-team-type`}
              resource={TeamTypeResource}
              field={FieldSelect}
              fullWidth={true}
              name="team_type"
              label="Team type"
              required="Enter a team type"
              initialValue={values.team_type}
            />
            {values.team_type && (
              <ResourceOptionsField
                id={`officer-hq-team-region-or-post`}
                resource={HQTeamRegionOrPostsResource}
                field={FieldSelect}
                fullWidth={true}
                payload={{ team_type: values.team_type }}
                name="hq_team_region_or_post"
                label="HQ team, Region or Post"
                required="Enter a HQ team, Region or Post"
                initialValue={values.hq_team_region_or_post}
              />
            )}
            <FieldAdvisersTypeahead
              name="team_members"
              label="Team members (optional)"
              hint="You can add up to 5 team members. They will be notified when this win is updated"
              validate={validators.validateTeamMembers}
              initialValue={
                exportProject
                  ? exportProject.teamMembers.map(({ name, id }) => ({
                      value: id,
                      label: name,
                    }))
                  : null
              }
              isMulti={true}
            />
          </>
        )}
      </Wrap>
    </Step>
  )
}

export default OfficerDetailsStep

import React from 'react'
import { useLocation } from 'react-router-dom'
import { H3 } from '@govuk-react/heading'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import { Step, FieldAdvisersTypeahead, FieldSelect } from '../../../components'
import * as validators from '../../../../client/components/Form/validators'
import { useFormContext } from '../../../../client/components/Form/hooks'
import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { idNameToValueLabel } from '../../../../client/utils'
import urls from '../../../../lib/urls'
import { steps } from './constants'
import {
  ExportResource,
  ExportWinsResource,
  TeamTypeResource,
  HQTeamRegionOrPostsResource,
} from '../../../components/Resource'

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
          ? urls.companies.exportWins.checkBeforeSending(queryParams.companywin)
          : queryParams.company
          ? urls.companies.overview.index(queryParams.company)
          : null
      }
    >
      <H3>Officer details</H3>
      {queryParams.export && (
        <PrepopulateFormFieldsFromExportProject
          id={queryParams.export}
          values={values}
        />
      )}
      {queryParams.exportwin && (
        <PrepopulateFormFieldsFromExportWin
          id={queryParams.exportwin}
          values={values}
        />
      )}
      {!queryParams.export && !queryParams.exportwin && (
        <FormFields values={values} />
      )}
    </Step>
  )
}

const FormFields = ({ owner, teamType, teamMembers, values }) => (
  <>
    <FieldAdvisersTypeahead
      name="owner"
      label="Owner name"
      required="Enter an owner"
      initialValue={[values.owner || owner]}
    />
    <ResourceOptionsField
      name="team_type"
      id={`officer-team-type`}
      resource={TeamTypeResource}
      field={FieldSelect}
      fullWidth={true}
      label="Team type"
      required="Enter a team type"
      initialValue={values.team_type || teamType}
    />
    {values.team_type && (
      <ResourceOptionsField
        name="hq_team_region_or_post"
        id={`officer-hq-team-region-or-post`}
        resource={HQTeamRegionOrPostsResource}
        field={FieldSelect}
        fullWidth={true}
        payload={{ team_type: values.team_type }}
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
      initialValue={values.team_members || teamMembers}
      isMulti={true}
    />
  </>
)

const PrepopulateFormFieldsFromExportProject = ({ id, values }) => (
  <ExportResource id={id}>
    {(exportProject) => (
      <FormFields
        owner={idNameToValueLabel(exportProject.owner)}
        teamMembers={exportProject.teamMembers.map(idNameToValueLabel)}
        values={values}
      />
    )}
  </ExportResource>
)

const PrepopulateFormFieldsFromExportWin = ({ id, values }) => (
  <ExportWinsResource id={id}>
    {(exportWin) => (
      <FormFields
        owner={exportWin.adviser}
        teamType={exportWin.team_type}
        values={values}
      />
    )}
  </ExportWinsResource>
)

export default OfficerDetailsStep

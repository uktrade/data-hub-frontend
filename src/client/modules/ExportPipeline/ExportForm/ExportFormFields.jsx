import React from 'react'
import PropTypes from 'prop-types'

import Form from '../../../components/Form'
import {
  FieldInput,
  FormLayout,
  FieldAdvisersTypeahead,
  FieldRadios,
  FieldDate,
  FieldSelect,
  FieldCurrency,
  FieldTypeahead,
  FieldTextarea,
} from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_SAVE_EXPORT } from './state'
import Task from '../../../components/Task'
import { ERROR_MESSAGES } from './constants'
import { transformAPIValuesForForm } from '../transformers'
import { validateTeamMembers } from './validation'
import { SECTOR_LABELS } from './labels'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import SectorResource from '../../../../client/components/Resource/Sector'
import ExportYearsResource from '../../../../client/components/Resource/ExportYears'
import { HintText } from 'govuk-react'
import Label from '@govuk-react/label'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import CountriesResource from '../../../../client/components/Resource/Countries'
import ExportExperience from '../../../components/Resource/ExportExperience'

const ExportFormFields = ({
  initialValues,
  analyticsFormName,
  flashMessage,
  cancelRedirectUrl,
  redirectToUrl,
  formDataLoaded,
  taskProps = {},
}) => (
  <Task.Status {...taskProps}>
    {() =>
      formDataLoaded && (
        <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
          <Form
            id="export-form"
            analyticsFormName={analyticsFormName}
            cancelRedirectTo={() => cancelRedirectUrl}
            redirectTo={() => redirectToUrl}
            submissionTaskName={TASK_SAVE_EXPORT}
            initialValues={
              initialValues && transformAPIValuesForForm(initialValues)
            }
            transformPayload={(values) => ({ exportId: values.id, values })}
            flashMessage={flashMessage}
          >
            {() => (
              <>
                <FieldInput
                  name="title"
                  label="Export title"
                  hint="It helps to give export details in the title, for example product and destination"
                  type="text"
                  required={ERROR_MESSAGES.title}
                />
                <FieldAdvisersTypeahead
                  name="owner"
                  label="Owner"
                  hint="When creating the record your name will appear. You can change the name to transfer ownership to someone else"
                  required={ERROR_MESSAGES.owner}
                />
                <FieldAdvisersTypeahead
                  name="team_members"
                  label="Team members (optional)"
                  hint="You can add up to 5 team members. Team members can view and edit export functionality"
                  isMulti={true}
                  validate={validateTeamMembers}
                />

                <Label
                  style={{ fontWeight: FONT_WEIGHTS.bold }}
                  htmlFor="field-estimated_export"
                >
                  Total estimated export value
                </Label>
                <HintText>
                  Select the year span and total value, for example 3 years,
                  £1,000,000
                </HintText>
                <div id="field-estimated_export">
                  <ResourceOptionsField
                    resource={ExportYearsResource}
                    field={FieldSelect}
                    fullWidth={true}
                    name="estimated_export_value_years"
                    label="Year(s)"
                    required={ERROR_MESSAGES.estimated_export_value_years}
                    boldLabel={false}
                  />
                  <FieldCurrency
                    name="estimated_export_value_amount"
                    label="Estimated value in GBP"
                    required={ERROR_MESSAGES.estimated_export_value_amount}
                    boldLabel={false}
                  />
                </div>
                <FieldDate
                  name="estimated_win_date"
                  format="short"
                  label="Estimated date for win"
                  hint="For example 11 2023"
                  required={ERROR_MESSAGES.estimated_win_date.required}
                  invalid={ERROR_MESSAGES.estimated_win_date.invalid}
                />
                <ResourceOptionsField
                  name="destination_country"
                  label="Destination"
                  required={ERROR_MESSAGES.destination_country}
                  resource={CountriesResource}
                  field={FieldTypeahead}
                />
                <ResourceOptionsField
                  name="sector"
                  label="Main sector"
                  hint="This is the main sector the company is exporting to. Additional sectors can be added to notes"
                  required={ERROR_MESSAGES.sector}
                  resource={SectorResource}
                  field={FieldTypeahead}
                />
                <FieldRadios
                  name="export_potential"
                  label="Export potential"
                  required={ERROR_MESSAGES.export_potential}
                  field={FieldRadios}
                  options={SECTOR_LABELS}
                />
                <ResourceOptionsField
                  resource={ExportExperience}
                  field={FieldRadios}
                  name="exporter_experience"
                  label="Exporter experience (optional)"
                />
                <FieldTextarea
                  name="notes"
                  label="Notes (optional)"
                  hint="Add further details about the export, such as additional sectors and country regions"
                />
              </>
            )}
          </Form>
        </FormLayout>
      )
    }
  </Task.Status>
)

ExportFormFields.propTypes = {
  initialValues: PropTypes.object,
  analyticsFormName: PropTypes.string.isRequired,
  flashMessage: PropTypes.func.isRequired,
  cancelRedirectUrl: PropTypes.string.isRequired,
  redirectToUrl: PropTypes.string.isRequired,
  taskProps: PropTypes.object,
  formDataLoaded: PropTypes.bool,
}

ExportFormFields.defaultProps = {
  formDataLoaded: false,
}

export default ExportFormFields

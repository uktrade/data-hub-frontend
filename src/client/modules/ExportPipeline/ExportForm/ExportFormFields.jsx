import React from 'react'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import Label from '@govuk-react/label'
import { HintText } from 'govuk-react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

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
  ContactInformation,
} from '../../../../client/components'
import {
  CountriesResource,
  ExportExperienceResource,
  ExportYearsResource,
  SectorResource,
  CompanyContactsResource,
} from '../../../components/Resource'

import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import Task from '../../../components/Task'

import { TASK_REDIRECT_TO_CONTACT_FORM } from '../../../components/ContactForm/state'
import { TASK_SAVE_EXPORT, ID as STATE_ID } from './state'

import { transformArrayIdNameToValueLabel } from '../../../transformers'
import { validateTeamMembers } from './validation'

import { STATUS_OPTIONS, EXPORT_POTENTIAL_OPTIONS } from '../constants'
import { ERROR_MESSAGES, POSITIVE_INT_REGEX } from './constants'
import { FORM_LAYOUT } from '../../../../common/constants'

export const isPositiveInteger = (value) => POSITIVE_INT_REGEX.test(value)

const ExportFormFields = ({
  analyticsFormName,
  flashMessage,
  cancelRedirectUrl,
  redirectToUrl,
  exportItem,
  formSubmitButtonLabel = 'Save',
  taskProps = {},
}) => (
  <Task.Status {...taskProps}>
    {() =>
      exportItem && (
        <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
          <Form
            id="export-form"
            analyticsFormName={analyticsFormName}
            cancelRedirectTo={() => cancelRedirectUrl}
            redirectTo={() => redirectToUrl}
            submissionTaskName={TASK_SAVE_EXPORT}
            initialValues={exportItem}
            transformPayload={(values) => ({ exportId: values.id, values })}
            flashMessage={flashMessage}
            submitButtonLabel={formSubmitButtonLabel}
          >
            {({ values }) => (
              <>
                <FieldInput
                  name="title"
                  label="Export title"
                  hint="It helps to give export details in the title, for example product and destination."
                  type="text"
                  required={ERROR_MESSAGES.title}
                />
                <FieldAdvisersTypeahead
                  name="owner"
                  label="Owner"
                  hint="When creating the record your name will appear. You can change the name to transfer ownership to someone else."
                  required={ERROR_MESSAGES.owner}
                />
                <FieldAdvisersTypeahead
                  name="team_members"
                  label="Team members (optional)"
                  hint="You can add up to 5 team members. Team members can view and edit this export record."
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
                  Select the year(s) and the total value. For example 3 years,
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
                    boldLabel={false}
                    validate={(value) => {
                      if (isPositiveInteger(value)) {
                        const formValue = parseInt(value, 10)
                        return formValue > 0
                          ? null
                          : ERROR_MESSAGES.estimated_export_value_amount
                      } else if (isEmpty(value)) {
                        return ERROR_MESSAGES.estimated_export_value_empty
                      } else {
                        return ERROR_MESSAGES.estimated_export_value_amount
                      }
                    }}
                  />
                </div>
                <FieldDate
                  name="estimated_win_date"
                  format="short"
                  label="Estimated date for win"
                  hint="For example 06 2023"
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
                  hint="This is the main sector the company is exporting to. Additional sectors can be added in the notes."
                  required={ERROR_MESSAGES.sector}
                  resource={SectorResource}
                  field={FieldTypeahead}
                />
                <FieldRadios
                  name="status"
                  label="Export status"
                  required={ERROR_MESSAGES.status}
                  field={FieldRadios}
                  options={STATUS_OPTIONS}
                />
                <FieldRadios
                  name="export_potential"
                  label="Export potential"
                  required={ERROR_MESSAGES.export_potential}
                  field={FieldRadios}
                  options={EXPORT_POTENTIAL_OPTIONS}
                />
                <ResourceOptionsField
                  id={exportItem.company.id}
                  name="contacts"
                  label="Company contacts"
                  required={ERROR_MESSAGES.contacts}
                  isMulti={true}
                  placeholder="Select contact"
                  resource={CompanyContactsResource}
                  field={FieldTypeahead}
                  resultToOptions={({ results }) =>
                    transformArrayIdNameToValueLabel(results)
                  }
                  autoScroll={values.scrollToContact}
                />
                <Task>
                  {(getTask) => {
                    const openContactFormTask = getTask(
                      TASK_REDIRECT_TO_CONTACT_FORM,
                      STATE_ID
                    )
                    return (
                      <ContactInformation
                        companyId={exportItem.company.id}
                        onOpenContactForm={({ redirectUrl }) => {
                          openContactFormTask.start({
                            payload: {
                              values,
                              url: redirectUrl,
                              storeId: STATE_ID,
                            },
                          })
                        }}
                      />
                    )
                  }}
                </Task>

                <ResourceOptionsField
                  resource={ExportExperienceResource}
                  field={FieldRadios}
                  name="exporter_experience"
                  label="Exporter experience (optional)"
                />
                <FieldTextarea
                  name="notes"
                  label="Notes (optional)"
                  hint="Add further details about the export, such as additional sectors and country regions."
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
  formSubmitButtonLabel: PropTypes.string,
}

export default ExportFormFields

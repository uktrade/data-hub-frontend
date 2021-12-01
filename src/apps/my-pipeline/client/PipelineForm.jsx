import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldRadios,
  FieldInput,
  FieldTypeahead,
  FieldDate,
} from '../../../client/components'

import TaskForm from '../../../client/components/Task/Form'
import Resource from '../../../client/components/Resource'

import { ID as STATE_ID, TASK_GET_PIPELINE_COMPANY_CONTACTS } from './state'
import { STATUS_VALUES, LIKELIHOOD_VALUES } from './constants'

const statusOptions = STATUS_VALUES.map(({ value, label }) => ({
  value,
  label,
}))

const likelihoodOptions = Object.values(LIKELIHOOD_VALUES)

const IS_NUMBER = /^[0-9]*$/
function PipelineForm({
  analyticsFormName,
  submissionTaskName,
  sectors,
  transformPayload,
  redirectTo,
  flashMessage,
  submitButtonLabel,
  companyId,
  actionLinks,
  initialValues,
}) {
  return (
    <TaskForm
      id={STATE_ID}
      analyticsFormName={analyticsFormName}
      submissionTaskName={submissionTaskName}
      transformPayload={transformPayload}
      redirectTo={redirectTo}
      flashMessage={flashMessage}
      submitButtonLabel={submitButtonLabel}
      actionLinks={actionLinks}
      initialValues={initialValues}
    >
      {({ values }) => (
        <>
          <FieldInput
            label="Project name"
            name="name"
            type="text"
            required="Enter a Project name"
            className="govuk-!-width-two-thirds"
          />
          <FieldRadios
            legend="Choose a status"
            name="category"
            required="Choose a status"
            options={statusOptions}
          />
          <FieldRadios
            legend="Likelihood to export (optional)"
            name="likelihood"
            options={likelihoodOptions.map(({ value, label }) => ({
              label,
              value: String(value),
            }))}
          />
          <FieldTypeahead
            label="Export sector (optional)"
            name="sector"
            options={sectors}
            placeholder="Search sectors..."
            isClearable={true}
            className="govuk-!-width-two-thirds"
          />
          {(values.company || companyId) && (
            <Resource
              name={TASK_GET_PIPELINE_COMPANY_CONTACTS}
              id="getCompanyContacts"
              payload={{
                params: {
                  company_id: companyId || values.company.id,
                  limit: 500,
                },
              }}
            >
              {(contacts) => (
                <FieldTypeahead
                  label="Company contacts (optional)"
                  name="contacts"
                  options={contacts.map(({ id, name, job_title }) => ({
                    value: id,
                    label: name + (job_title ? ', ' + job_title : ''),
                  }))}
                  noOptionsMessage={() => 'This company has no contacts'}
                  placeholder="Select a contact..."
                  isClearable={true}
                  className="govuk-!-width-two-thirds"
                  isMulti="true"
                />
              )}
            </Resource>
          )}
          <FieldInput
            label="Potential export value (optional)"
            hint="Amount in GBP"
            name="export_value"
            type="text"
            pattern="[0-9]*"
            inputmode="numeric"
            spellcheck="false"
            className="govuk-input--width-10"
            validate={(value) =>
              !value || IS_NUMBER.test(value)
                ? null
                : 'Potential export value must be a number'
            }
          />
          <FieldDate
            format="short"
            label="Expected date for win (optional)"
            hint="For example 11 2020"
            name="expected_win_date"
          />
        </>
      )}
    </TaskForm>
  )
}

PipelineForm.propTypes = {
  initialValue: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  sectors: PropTypes.array.isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  submissionTaskName: PropTypes.string.isRequired,
  initialValuesTaskName: PropTypes.string,
  analyticsFormName: PropTypes.string.isRequired,
  transformPayload: PropTypes.func.isRequired,
  redirectTo: PropTypes.func.isRequired,
  flashMessage: PropTypes.func.isRequired,
  submitButtonLabel: PropTypes.string,
  actionLinks: PropTypes.array,
}

export default PipelineForm

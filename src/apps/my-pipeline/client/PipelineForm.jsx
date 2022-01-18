import React from 'react'
import PropTypes from 'prop-types'

import {
  FieldRadios,
  FieldInput,
  FieldTypeahead,
  FieldDate,
} from '../../../client/components'

import Form from '../../../client/components/Form'
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
  cancelRedirectTo,
  cancelButtonLabel,
  initialValues,
}) {
  return (
    <div className="govuk-!-width-two-thirds">
      <Form
        id={STATE_ID}
        analyticsFormName={analyticsFormName}
        submissionTaskName={submissionTaskName}
        transformPayload={transformPayload}
        redirectTo={redirectTo}
        flashMessage={flashMessage}
        submitButtonLabel={submitButtonLabel}
        initialValues={initialValues}
        cancelRedirectTo={cancelRedirectTo}
        cancelButtonLabel={cancelButtonLabel}
      >
        {({ values }) => (
          <>
            <FieldInput
              label="Project name"
              name="name"
              type="text"
              required="Enter a Project name"
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
            />
            {/*
              This template form needs to cater for both the Add and Edit use cases.
              As both use cases have different params we need to check where to get
              the company information from before firing the resource.
            */}
            {(values.company || companyId) && (
              <Resource
                name={TASK_GET_PIPELINE_COMPANY_CONTACTS}
                id="getCompanyContacts"
                payload={{ companyId: companyId || values.company.id }}
              >
                {(contacts) => (
                  <FieldTypeahead
                    label="Company contacts (optional)"
                    name="contacts"
                    options={contacts.map(({ id, name, job_title }) => ({
                      value: id,
                      label: name + (job_title ? ', ' + job_title : ''),
                    }))}
                    noOptionsMessage="This company has no contacts"
                    placeholder="Select a contact..."
                    isClearable={true}
                    isMulti={true}
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
      </Form>
    </div>
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
  cancelRedirectTo: PropTypes.func,
  cancelButtonLabel: PropTypes.string,
}

export default PipelineForm

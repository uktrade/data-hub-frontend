import React from 'react'
import { ERROR_COLOUR } from 'govuk-colours'
import styled from 'styled-components'

import Task from '../../../../../../client/components/Task'
import Form from '../../../../../../client/components/Form'
import { ID as TASK_ID, TASK_NAME, API_ERROR, API_WARN } from './state'
import urls from '../../../../../../lib/urls'
import {
  StatusMessage,
  FieldTypeahead,
} from '../../../../../../client/components/'

const StyledH2 = styled.h2`
  font-weight: bold;
`
const StyledP = styled.p`
  margin: 0;
`

function ErrorHandler({ errorMessage }) {
  return (
    <>
      {errorMessage[API_ERROR] && (
        <StatusMessage
          colour={ERROR_COLOUR}
          aria-labelledby="api-error-summary-title"
          role="alert"
        >
          <StyledH2 id="api-error-summary-title">
            {errorMessage[API_ERROR]}
          </StyledH2>
        </StatusMessage>
      )}

      {errorMessage[API_WARN] && (
        <StatusMessage aria-labelledby="error-summary-title" role="alert">
          <StyledH2 id="error-summary-title">
            Export countries could not be saved, try again later.
          </StyledH2>
          <StyledP>{errorMessage[API_WARN]}</StyledP>
        </StatusMessage>
      )}
    </>
  )
}

export default ({ companyId, countryOptions, fields }) => {
  return (
    <Task.Status
      name={TASK_NAME}
      id={TASK_ID}
      renderProgress={() => null}
      renderError={ErrorHandler}
    >
      {() => (
        <Form
          id={TASK_ID}
          name={TASK_NAME}
          submitButtonLabel="Save and return"
          transformPayload={(values) => ({ values, companyId })}
          redirectTo={() => urls.companies.exports.index(companyId)}
          submissionTaskName={TASK_NAME}
          analyticsFormName="exportCountriesEdit"
          cancelRedirectTo={() => urls.companies.exports.index(companyId)}
          cancelButtonLabel="Return without saving"
          initialValues={fields
            .filter(({ values }) => !!values?.length)
            .reduce((acc, { name, values }) => {
              acc[name] = values
              return acc
            }, {})}
        >
          {fields.map(({ label, name }) => (
            <FieldTypeahead
              key={name}
              isMulti={true}
              label={label}
              name={name}
              options={countryOptions}
              placeholder="Search countries..."
            />
          ))}
        </Form>
      )}
    </Task.Status>
  )
}

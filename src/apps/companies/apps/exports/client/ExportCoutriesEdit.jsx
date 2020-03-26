import React, { useState } from 'react'
import { Button, Link } from 'govuk-react'
import { ERROR_COLOUR } from 'govuk-colours'
import styled from 'styled-components'
import {
  FormActions,
  FieldTypeahead,
  FormStateful,
  StatusMessage,
} from 'data-hub-components'
import axios from 'axios'

import getExportCountries from '../../../../../lib/get-export-countries'
import urls from '../../../../../lib/urls'

const StyledH2 = styled.h2`
  font-weight: bold;
`
const StyledP = styled.p`
  margin: 0;
`

function convertFieldValues(fields) {
  const countryFields = {}
  for (const [name, values] of Object.entries(fields)) {
    countryFields[name] = values?.map(({ value }) => value)
  }
  return countryFields
}

function saveExportCountries(companyId, setApiError) {
  return async (values) => {
    try {
      await axios.patch(`/api-proxy/v4/company/${companyId}/export-detail`, {
        export_countries: getExportCountries(convertFieldValues(values)) || [],
      })

      return urls.companies.exports.index(companyId)
    } catch (e) {
      const is400 = e?.response?.status === 400
      const nonFieldMessages = is400 && e.response.data?.non_field_errors
      if (nonFieldMessages?.length) {
        setApiError(nonFieldMessages.join(', '))
      } else {
        throw e.message
      }
    }
  }
}

export default ({ companyId, countryOptions, fields }) => {
  const [apiError, setApiError] = useState()

  return (
    <FormStateful
      onSubmit={saveExportCountries(companyId, setApiError)}
      initialValues={fields.reduce((formValues, { name, values }) => {
        if (values?.length) {
          formValues[name] = values
        }
        return formValues
      }, {})}
    >
      {({ submissionError }) => (
        <>
          {apiError && (
            <StatusMessage
              colour={ERROR_COLOUR}
              aria-labelledby="api-error-summary-title"
              role="alert"
            >
              <StyledH2 id="api-error-summary-title">{apiError}</StyledH2>
            </StatusMessage>
          )}

          {submissionError && (
            <StatusMessage aria-labelledby="error-summary-title" role="alert">
              <StyledH2 id="error-summary-title">
                Export countries could not be saved, try again later.
              </StyledH2>
              <StyledP>{submissionError}</StyledP>
            </StatusMessage>
          )}

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
          <FormActions>
            <Button>Save and return</Button>
            <Link href={urls.companies.exports.index(companyId)}>
              Return without saving
            </Link>
          </FormActions>
        </>
      )}
    </FormStateful>
  )
}

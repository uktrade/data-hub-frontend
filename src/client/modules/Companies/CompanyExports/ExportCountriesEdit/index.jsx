import React from 'react'
import styled from 'styled-components'

import { ERROR_COLOUR } from '../../../../utils/colours'
import Task from '../../../../components/Task'
import Form from '../../../../components/Form'
import { ID as TASK_ID, TASK_NAME, API_ERROR, API_WARN } from './state'
import urls from '../../../../../lib/urls'
import {
  StatusMessage,
  FieldTypeahead,
  FormLayout,
  LocalHeader,
  Main,
} from '../../../../components'
import { FORM_LAYOUT } from '../../../../../common/constants'
import {
  CompanyResource,
  CountriesResource,
} from '../../../../components/Resource'
import { transformCountriesForTypeahead } from '../transformers'
import { transformArrayIdNameToValueLabel } from '../../../../transformers'
import { buildCompanyBreadcrumbs } from '../../utils'

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

export default ({ companyId }) => (
  <CompanyResource id={companyId}>
    {(company) => (
      <CountriesResource>
        {(countryOptions) => (
          <>
            <LocalHeader
              heading={'Edit export countries'}
              breadcrumbs={buildCompanyBreadcrumbs(
                [
                  {
                    link: urls.companies.exports.index(companyId),
                    text: 'Exports',
                  },
                  { text: 'Edit export countries' },
                ],
                company.id,
                company.name
              )}
            />
            <Main>
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
                    cancelRedirectTo={() =>
                      urls.companies.exports.index(companyId)
                    }
                    cancelButtonLabel="Return without saving"
                    initialValues={transformCountriesForTypeahead(
                      company.exportCountries
                    )
                      .filter(({ values }) => !!values?.length)
                      .reduce((acc, { name, values }) => {
                        acc[name] = values
                        return acc
                      }, {})}
                  >
                    <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
                      {transformCountriesForTypeahead(
                        company.exportCountries
                      ).map(({ label, name }) => (
                        <FieldTypeahead
                          key={name}
                          isMulti={true}
                          label={label}
                          name={name}
                          options={transformArrayIdNameToValueLabel(
                            countryOptions
                          )}
                          placeholder="Search countries..."
                        />
                      ))}
                    </FormLayout>
                  </Form>
                )}
              </Task.Status>
            </Main>
          </>
        )}
      </CountriesResource>
    )}
  </CompanyResource>
)

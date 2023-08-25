import React from 'react'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { FieldInput, FieldSelect, LocalHeader, Main } from '../../../components'
import GreatProfile from '../../../../apps/companies/apps/exports/client/GreatProfile'
import urls from '../../../../lib/urls'
import Form from '../../../components/Form'
import {
  CompanyResource,
  ExportExperienceCategoriesResource,
} from '../../../components/Resource'
import { transformArrayIdNameToValueLabel } from '../../../transformers'
import { exportDetailsLabels } from '../../../../apps/companies/labels'
import { buildCompanyBreadcrumbs } from '../utils'

const StyledDt = styled.dt`
  margin-bottom: ${SPACING_POINTS[1]}px;
`
const StyledDd = styled.dd`
  margin-bottom: ${SPACING_POINTS[6]}px;
`

export default ({ companyId }) => (
  <CompanyResource id={companyId}>
    {(company) => (
      <ExportExperienceCategoriesResource>
        {(exportWinCategories) => (
          <>
            <LocalHeader
              heading={'Edit exports'}
              breadcrumbs={buildCompanyBreadcrumbs(
                [
                  {
                    link: urls.companies.exports.index(companyId),
                    text: 'Exports',
                  },
                  { text: 'Edit' },
                ],
                company.id,
                company.name
              )}
            />
            <Main>
              <Form
                id="exports-edit"
                submissionTaskName="Exports Edit"
                analyticsFormName="exportsEdit"
                transformPayload={(values) => ({ ...values, companyId })}
                redirectTo={() => urls.companies.exports.index(companyId)}
                submitButtonLabel="Save and return"
                cancelRedirectTo={() => urls.companies.exports.index(companyId)}
                cancelButtonLabel="Return without saving"
              >
                <FieldSelect
                  emptyOption="-- Select category --"
                  label="Export win category (optional)"
                  name="export_experience_category"
                  options={transformArrayIdNameToValueLabel(
                    exportWinCategories
                  )}
                  initialValue={company.exportExperienceCategory?.id}
                />
                <dl>
                  <StyledDt>{exportDetailsLabels.greatProfile}</StyledDt>
                  <StyledDd>
                    <GreatProfile
                      {...{
                        profileStatus: company.greatProfileStatus,
                        companyNumber: company.companyNumber,
                      }}
                    />
                  </StyledDd>

                  <StyledDt>{exportDetailsLabels.exportPotential}</StyledDt>
                  <StyledDd>Unavailable</StyledDd>
                </dl>
                <FieldInput
                  type="hidden"
                  name="companyId"
                  initialValue={companyId}
                />
              </Form>
            </Main>
          </>
        )}
      </ExportExperienceCategoriesResource>
    )}
  </CompanyResource>
)

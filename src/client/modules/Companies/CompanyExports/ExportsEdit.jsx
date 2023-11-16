import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { SPACING_POINTS } from '@govuk-react/constants'

import { DefaultLayout, FieldInput, FieldSelect } from '../../../components'
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

const ExportsEdit = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <ExportExperienceCategoriesResource>
          {(exportWinCategories) => (
            <DefaultLayout
              heading="Edit exports"
              pageTitle={`Edit exports - Exports - ${company.name} - Companies`}
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
            >
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
            </DefaultLayout>
          )}
        </ExportExperienceCategoriesResource>
      )}
    </CompanyResource>
  )
}

export default ExportsEdit

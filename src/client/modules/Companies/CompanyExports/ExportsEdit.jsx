import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom-v5-compat'
import { SPACING_POINTS } from '@govuk-react/constants'

import {
  DefaultLayout,
  FieldInput,
  FieldSelect,
  Form,
} from '../../../components'
import GreatProfile from './GreatProfile'
import urls from '../../../../lib/urls'
import {
  CompanyResource,
  ExportExperienceCategoriesResource,
} from '../../../components/Resource'
import { transformArrayIdNameToValueLabel } from '../../../transformers'
import {
  buildExportPotential,
  buildExportPotentialLastModified,
} from './transformers'
import { exportDetailsLabels } from './labels'
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
                  <StyledDd>{buildExportPotential(company)}</StyledDd>
                  <StyledDt>
                    {exportDetailsLabels.lastModifiedPotential}
                  </StyledDt>
                  <StyledDd>
                    {buildExportPotentialLastModified(company)}
                  </StyledDd>
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

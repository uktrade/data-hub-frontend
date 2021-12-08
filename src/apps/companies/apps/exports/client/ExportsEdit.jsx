import React from 'react'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'
import { FieldInput, FieldSelect } from '../../../../../client/components'

import GreatProfile from './GreatProfile'
import urls from '../../../../../lib/urls'
import TaskForm from '../../../../../client/components/Task/Form'

const StyledDt = styled.dt`
  margin-bottom: ${SPACING_POINTS[1]}px;
`
const StyledDd = styled.dd`
  margin-bottom: ${SPACING_POINTS[6]}px;
`

export default ({
  companyId,
  companyNumber,
  exportWinCategoryValue,
  greatProfile,
  exportPotential,
  exportWinCategories,
}) => (
  <TaskForm
    id="exports-edit"
    submissionTaskName="Exports Edit"
    analyticsFormName="exportsEdit"
    transformPayload={(values) => ({ ...values, companyId })}
    redirectTo={() => urls.companies.exports.index(companyId)}
    submitButtonLabel="Save and return"
    actionLinks={[
      {
        children: 'Return without saving',
        href: urls.companies.exports.index(companyId),
      },
    ]}
  >
    <FieldSelect
      emptyOption="-- Select category --"
      label="Export win category (optional)"
      name="export_experience_category"
      options={exportWinCategories}
      initialValue={exportWinCategoryValue?.id}
    />
    <dl>
      <StyledDt>great.gov.uk business profile</StyledDt>
      <StyledDd>
        <GreatProfile {...{ profile: greatProfile, companyNumber }} />
      </StyledDd>

      <StyledDt>Export potential</StyledDt>
      <StyledDd>
        {exportPotential.value ? exportPotential.value : 'No score given'}
      </StyledDd>
    </dl>
    <FieldInput type="hidden" name="companyId" initialValue={companyId} />
  </TaskForm>
)

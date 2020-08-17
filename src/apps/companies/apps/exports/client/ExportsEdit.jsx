import React from 'react'
import styled from 'styled-components'
import { Button, Link } from 'govuk-react'
import axios from 'axios'
import { SPACING_POINTS } from '@govuk-react/constants'
import {
  FormActions,
  FieldSelect,
  FormStateful,
} from '../../../../../client/components'

import GreatProfile from './GreatProfile'
import urls from '../../../../../lib/urls'

const EXPORT_WIN_FIELD_NAME = 'export_experience_category'

const StyledDt = styled.dt`
  margin-bottom: ${SPACING_POINTS[1]}px;
`
const StyledDd = styled.dd`
  margin-bottom: ${SPACING_POINTS[6]}px;
`

function saveWinCategory(companyId) {
  return async (values) => {
    await axios.patch(`/api-proxy/v4/company/${companyId}`, {
      [EXPORT_WIN_FIELD_NAME]: values[EXPORT_WIN_FIELD_NAME] || null,
    })

    return urls.companies.exports.index(companyId)
  }
}
export default ({
  companyId,
  companyNumber,
  exportWinCategoryValue,
  greatProfile,
  exportPotential,
  exportWinCategories,
}) => (
  <FormStateful
    onSubmit={saveWinCategory(companyId)}
    initialValues={{
      [EXPORT_WIN_FIELD_NAME]: exportWinCategoryValue?.id,
    }}
  >
    <FieldSelect
      emptyOption="-- Select category --"
      label="Export win category (optional)"
      name={EXPORT_WIN_FIELD_NAME}
      options={exportWinCategories}
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

    <FormActions>
      <Button>Save and return</Button>
      <Link href={urls.companies.exports.index(companyId)}>
        Return without saving
      </Link>
    </FormActions>
  </FormStateful>
)

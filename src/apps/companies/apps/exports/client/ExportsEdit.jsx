import React from 'react'
import styled from 'styled-components'
import { Button } from 'govuk-react'
import { FormActions, FieldSelect, Form, ButtonLink } from 'data-hub-components'
import axios from 'axios'

import GreatProfile from './GreatProfile'
import urls from '../../../../../lib/urls'

const EXPORT_WIN_FIELD_NAME = 'export_experience_category'

const StyledDt = styled.dt`
  margin-bottom: 5px;
`
const StyledDd = styled.dd`
  margin-bottom: 30px;
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
  <Form
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
      <ButtonLink>Return without saving</ButtonLink>
    </FormActions>
  </Form>
)

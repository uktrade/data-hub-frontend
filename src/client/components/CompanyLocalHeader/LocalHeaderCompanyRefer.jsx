import React from 'react'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'

import { GREY_3, GREY_3_LEGACY } from '../../../client/utils/colours'
import urls from '../../../lib/urls'

const StyledCompanyReferButton = styled('button')`
  display: inline-table;
  padding: 4px 8px 4px 8px;
  border: none;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 10px;
  font-size: ${FONT_SIZE.SIZE_14};
  span {
    pointer-events: none;
    display: inline-block;
  }
  background-color: ${GREY_3};
  border-bottom: 3px solid ${GREY_3_LEGACY};
`

const LocalHeaderCompanyRefer = ({ companyId }) => {
  const handleClickRefer = () => {
    window.location.href = urls.companies.referrals.send(companyId)
  }
  return (
    <>
      <StyledCompanyReferButton
        data-test="refer-company-button"
        onClick={handleClickRefer}
      >
        <span>Refer this company</span>
      </StyledCompanyReferButton>
    </>
  )
}

export default LocalHeaderCompanyRefer

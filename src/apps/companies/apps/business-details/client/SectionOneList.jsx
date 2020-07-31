import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'

import { SummaryTable } from '../../../../../client/components/'

const StyledSummaryFooterLink = styled(Link)`
  margin-top: -${SPACING_POINTS[7]}px;
  display: block;
`

const SectionOneList = ({ businessDetails, isArchived, isDnbCompany, urls }) =>
  businessDetails.one_list_group_global_account_manager ? (
    <>
      <SummaryTable
        caption="Global Account Manager – One List"
        data-auto-id="oneListDetailsContainer"
        actions={
          !isArchived &&
          !isDnbCompany && <Link href={urls.companyEdit}>Edit</Link>
        }
      >
        <SummaryTable.Row heading="One List tier">
          {businessDetails.one_list_group_tier}
        </SummaryTable.Row>

        <SummaryTable.Row heading="Global Account Manager">
          {businessDetails.one_list_group_global_account_manager}
        </SummaryTable.Row>
      </SummaryTable>

      <StyledSummaryFooterLink href={urls.companyAdvisers}>
        See all advisers on the core team
      </StyledSummaryFooterLink>
    </>
  ) : null

SectionOneList.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  isArchived: PropTypes.bool.isRequired,
  isDnbCompany: PropTypes.bool.isRequired,
  urls: PropTypes.object.isRequired,
}

export default SectionOneList

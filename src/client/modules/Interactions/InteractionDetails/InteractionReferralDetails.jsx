import React from 'react'
import { SPACING_POINTS } from '@govuk-react/constants'
import styled from 'styled-components'

import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import AccessibleLink from '../../../components/Link'

const { formatDate, DATE_FORMAT_COMPACT } = require('../../../utils/date-utils')

const StyledSummaryTable = styled(SummaryTable)({
  'margin-top': SPACING_POINTS[8],
})

const InteractionReferralDetails = ({ referral, companyId }) => {
  return (
    <StyledSummaryTable
      caption="This interaction is linked to a referral"
      data-test="interaction-referral-table"
    >
      <SummaryTable.Row heading="Subject">
        <AccessibleLink
          href={urls.companies.referrals.details(companyId, referral.id)}
        >
          {referral.subject}
        </AccessibleLink>
      </SummaryTable.Row>
      <SummaryTable.Row heading="Sent on">
        {formatDate(referral.createdOn, DATE_FORMAT_COMPACT)}
      </SummaryTable.Row>
      <SummaryTable.Row heading="By">
        {referral.createdBy.name}
      </SummaryTable.Row>
      <SummaryTable.Row heading="To">
        {referral.recipient.name}
      </SummaryTable.Row>
    </StyledSummaryTable>
  )
}

export default InteractionReferralDetails

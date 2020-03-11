import React from 'react'
import { SummaryTable, DateUtils } from 'data-hub-components'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import urls from '../../../../../lib/urls'

const StyledSummaryTable = styled(SummaryTable)`
  margin: 56px 0 32px;
`

const InteractionReferralDetails = ({
  id,
  subject,
  created_by,
  recipient,
  created_on,
}) => {
  return (
    <StyledSummaryTable
      caption="This interaction is linked to a referral"
      data-auto-id="interactionDetailsContainer"
    >
      <SummaryTable.Row heading="Subject">
        <Link href={urls.referrals.details(id)}>{subject}</Link>
      </SummaryTable.Row>
      <SummaryTable.Row heading="Sent on">
        {DateUtils.format(created_on)}
      </SummaryTable.Row>
      <SummaryTable.Row heading="By">{created_by.name}</SummaryTable.Row>
      <SummaryTable.Row heading="To">{recipient.name}</SummaryTable.Row>
    </StyledSummaryTable>
  )
}

export default InteractionReferralDetails

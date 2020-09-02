import React from 'react'
import { SPACING_POINTS } from '@govuk-react/constants'
import { Link } from 'govuk-react'
import styled from 'styled-components'

import { SummaryTable } from '../../../../../../client/components/'
import { format } from '../../../../../../client/utils/date-utils'
import urls from '../../../../../../lib/urls'

const StyledSummaryTable = styled(SummaryTable)({
  'margin-top': SPACING_POINTS[8],
})

const InteractionReferralDetails = ({
  id,
  subject,
  created_by,
  recipient,
  created_on,
  companyId,
}) => {
  return (
    <StyledSummaryTable
      caption="This interaction is linked to a referral"
      data-auto-id="interactionDetailsContainer"
    >
      <SummaryTable.Row heading="Subject">
        <Link href={urls.companies.referrals.details(companyId, id)}>
          {subject}
        </Link>
      </SummaryTable.Row>
      <SummaryTable.Row heading="Sent on">
        {format(created_on)}
      </SummaryTable.Row>
      <SummaryTable.Row heading="By">{created_by.name}</SummaryTable.Row>
      <SummaryTable.Row heading="To">{recipient.name}</SummaryTable.Row>
    </StyledSummaryTable>
  )
}

export default InteractionReferralDetails

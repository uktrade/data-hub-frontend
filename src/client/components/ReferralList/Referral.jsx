import { capitalize } from 'lodash'
import React from 'react'
import { Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { BLUE, GREEN } from 'govuk-colours'
import PropTypes from 'prop-types'
import { SummaryList } from 'data-hub-components'
import styled from 'styled-components'
import Card from 'data-hub-components/dist/activity-feed/activities/card/Card'
import CardHeader from 'data-hub-components/dist/activity-feed/activities/card/CardHeader'

import urls from '../../../lib/urls'
import { AdviserDetails } from '../../../apps/referrals/apps/details/client/ReferralDetails'

const STATUS_COLOURS = {
  outstanding: BLUE,
  completed: GREEN,
}

const StyledSummaryListWrapper = styled.div({
  flexGrow: 1,
  marginRight: SPACING.SCALE_2,
  dt: {
    // Prevent he left column from shrinking,
    // when the right column's content is too long.
    flexShrink: 0,
    // The original 30% column width doesn't work well in this usecase
    flexBasis: 160,
  },
})

const Referral = ({
  id,
  companyName,
  subject,
  date,
  sender,
  recipient,
  status,
}) => (
  <Card>
    <CardHeader
      company={{ name: companyName }}
      heading={<Link href={urls.referrals.details(id)}>{subject}</Link>}
      startTime={date}
      badge={{
        text: `${capitalize(status)} referral`,
        borderColour: STATUS_COLOURS[status],
      }}
    />
    {/* SummaryList is not stylable so we need to wrap it to tweak it's styles */}
    <StyledSummaryListWrapper>
      <SummaryList
        rows={[
          {
            label: 'Sending adviser',
            value: <AdviserDetails {...sender} />,
          },
          {
            label: 'Receiving adviser',
            value: <AdviserDetails {...recipient} />,
          },
        ]}
      />
    </StyledSummaryListWrapper>
  </Card>
)

Referral.propTypes = {
  id: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sender: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  recipient: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  status: PropTypes.oneOf(['outstanding', 'completed']),
}

export default Referral

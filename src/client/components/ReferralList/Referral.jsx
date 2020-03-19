import React from 'react'
import { Link } from 'govuk-react'
import { SPACING } from '@govuk-react/constants'
import { BLUE, GREEN } from 'govuk-colours'
import PropTypes from 'prop-types'
import { SummaryList, DateUtils } from 'data-hub-components'
import styled from 'styled-components'
import Card from 'data-hub-components/dist/activity-feed/activities/card/Card'
import CardHeader from 'data-hub-components/dist/activity-feed/activities/card/CardHeader'

import urls from '../../../lib/urls'
import { AdviserDetails } from '../../../apps/companies/apps/referrals/details/client/ReferralDetails'

const StyledSummaryListWrapper = styled.div({
  flexGrow: 1,
  marginRight: SPACING.SCALE_2,
  dt: {
    // Prevent the left column from shrinking,
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
  dateAccepted,
}) => (
  <Card>
    <CardHeader
      company={{ name: companyName }}
      heading={
        <Link href={urls.companies.referrals.details(id)}>{subject}</Link>
      }
      startTime={date}
      badge={
        dateAccepted
          ? {
              text: 'Referral accepted',
              borderColour: GREEN,
            }
          : {
              text: 'Outstanding referral',
              borderColour: BLUE,
            }
      }
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
          ...(dateAccepted
            ? [
                {
                  label: 'Accepted on',
                  value: DateUtils.format(dateAccepted),
                },
              ]
            : []),
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
  dateAccepted: PropTypes.string,
}

export default Referral

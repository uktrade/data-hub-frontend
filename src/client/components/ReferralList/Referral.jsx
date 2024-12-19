import React from 'react'
import { Link } from 'govuk-react'
import { SPACING, FONT_SIZE } from '@govuk-react/constants'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { BLUE, GREEN } from '../../../client/utils/colours'
import { AdviserDetails } from '../../../apps/companies/apps/referrals/details/client/ReferralDetails'
import { Card, CardHeader } from '../ActivityFeed/activities/card'
import SummaryList from '../../components/SummaryList'
import urls from '../../../lib/urls'
import { formatDate, DATE_FORMAT_COMPACT } from '../../utils/date-utils'

const StyledSummaryListWrapper = styled.div({
  flexGrow: 1,
  marginRight: SPACING.SCALE_2,
  dt: {
    fontSize: `${FONT_SIZE.SIZE_16}`,
    // Prevent the left column from shrinking,
    // when the right column's content is too long.
    flexShrink: 0,
    // The original 30% column width doesn't work well in this usecase
    flexBasis: 160,
  },
  dd: {
    fontSize: `${FONT_SIZE.SIZE_16}`,
  },
})

const Referral = ({
  id,
  companyId,
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
        <Link href={urls.companies.referrals.details(companyId, id)}>
          {subject}
        </Link>
      }
      headingLevel={2}
      startTime={date}
      badge={
        dateAccepted
          ? {
              text: 'Accepted referral',
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
                  value: formatDate(dateAccepted, DATE_FORMAT_COMPACT),
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
  companyId: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sender: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  recipient: PropTypes.shape(AdviserDetails.propTypes).isRequired,
  dateAccepted: PropTypes.string,
}

export default Referral

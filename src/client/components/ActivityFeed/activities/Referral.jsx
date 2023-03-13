import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { SPACING, MEDIA_QUERIES } from '@govuk-react/constants'

import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'
import ReferralUtils from './ReferralUtils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import Tag from '../../Tag'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

const { format } = require('../../../utils/date')

const Row = styled('div')`
  display: grid;
  ${MEDIA_QUERIES.TABLET} {
    display: flex;
  }
`

// On mobile the order of the columns are swapped
const LeftCol = styled('div')`
  order: 2;
  ${MEDIA_QUERIES.TABLET} {
    order: 1;
    flex: 75%;
  }
`

// On mobile the order of the columns are swapped
const RightCol = styled('div')`
  order: 1;
  margin-bottom: ${SPACING.SCALE_1};
  ${MEDIA_QUERIES.TABLET} {
    order: 2;
    flex: 25%;
  }
`

export default class Referral extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Referral)
  }

  render() {
    const { activity, isOverview } = this.props
    const {
      id,
      companyId,
      subject,
      startTime,
      sender,
      recipient,
      completedOn,
    } = ReferralUtils.transformReferral(activity)
    const url = `/companies/${companyId}/referrals/${id.split(':')[2]}`
    const badge = ReferralUtils.getStatus(activity)
    const AdviserDetails = ({ name, email, team }) =>
      isOverview ? (
        `${name}` + (team ? `, ${team}` : ``)
      ) : (
        <>
          {name}
          {email && (
            <>
              , <a href={`mailto:${email}`}>{email}</a>
            </>
          )}
          {team && <>, {team}</>}
        </>
      )

    const date = !completedOn && format(startTime)

    const metadata = [
      { label: 'Date', value: date },
      {
        label: 'Sending adviser',
        value: AdviserDetails(sender),
      },
      {
        label: 'Receiving adviser',
        value: AdviserDetails(recipient),
      },
      {
        label: 'Completed date',
        value: completedOn && format(completedOn),
      },
    ]

    const linkedSubject = <Link href={url}>{subject}</Link>

    return isOverview ? (
      <ActivityOverviewSummary
        dataTest="averntry-event-summary"
        activity={activity}
        date={date}
        kind={badge.text}
        url={url}
        subject={linkedSubject}
        summary={[
          'Completed sending adviser ',
          AdviserDetails(sender),
          ' receiving adviser ',
          AdviserDetails(recipient),
        ]}
      ></ActivityOverviewSummary>
    ) : (
      <ActivityCardWrapper dataTest="referral-activity">
        <Row>
          <LeftCol>
            <ActivityCardSubject
              margin={{ top: 0, bottom: 10 }}
              dataTest="referral-activity-card-subject"
            >
              {linkedSubject}
            </ActivityCardSubject>
            <ActivityCardMetadata metadata={metadata} />
          </LeftCol>
          <RightCol>
            <Tag colour="grey" data-test="activity-kind-label">
              {badge.text}
            </Tag>
          </RightCol>
        </Row>
      </ActivityCardWrapper>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'
import ReferralUtils from './ReferralUtils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import Tag, { TAG_COLOURS } from '../../Tag'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'
import OverviewActivityCardWrapper from './card/OverviewActivityCardWrapper'

const { format } = require('../../../utils/date')

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
      <OverviewActivityCardWrapper dataTest={`referral-summary`}>
        <ActivityOverviewSummary
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
      </OverviewActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="referral-activity">
        <ActivityCardSubject dataTest="referral-activity-card-subject">
          {linkedSubject}
        </ActivityCardSubject>
        <Tag color={TAG_COLOURS.GREY} data-test="activity-kind-label">
          {badge.text}
        </Tag>
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'
import ReferralUtils from './ReferralUtils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

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

    const Row = styled('div')`
      display: flex;
    `

    const LeftCol = styled('div')`
      flex: 75%;
    `

    const RightCol = styled('div')`
      flex: 25%;
    `

    return isOverview ? (
      <ActivityOverviewSummary
        dataTest="averntry-event-summary"
        activity={activity}
        date={date}
        kind={badge.text}
        url={url}
        subject={`${subject}`}
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
            <ActivityCardSubject dataTest="referral-activity-card-subject">
              <Link href={url}>{subject}</Link>
            </ActivityCardSubject>
            <ActivityCardMetadata metadata={metadata} />
          </LeftCol>
          <RightCol>
            <ActivityCardLabels kind={badge.text} />
          </RightCol>
        </Row>
      </ActivityCardWrapper>
    )
  }
}

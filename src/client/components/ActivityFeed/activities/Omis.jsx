import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import { AdviserItemRenderer, ContactItemRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

const { format } = require('../../../utils/date')

export default class Omis extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Omis)
  }

  render() {
    const { activity, isOverview } = this.props

    const published = get(activity, 'published')
    const reference = get(activity, 'object.name')
    const country = get(activity, 'object.dit:country.name')
    const ukRegion = get(activity, 'object.dit:ukRegion.name')
    const url = get(activity, 'object.url')
    const adviser = CardUtils.getAdviser(activity)
    const contacts = CardUtils.getContacts(activity)
    const date = format(published)

    const metadata = [
      { label: 'Date', value: date },
      { label: 'Country', value: country },
      { label: 'UK region', value: ukRegion },
      {
        label: 'Added by',
        value: adviser
          ? [adviser].map((adviser, index) => (
              <span key={adviser.id}>
                {AdviserItemRenderer(adviser, index)}
              </span>
            ))
          : null,
      },
      {
        label: 'Company contact',
        value: contacts.map((contact, index) => (
          <span key={contact.id}>{ContactItemRenderer(contact, index)}</span>
        )),
      },
    ]

    const href = `${url}/work-order`
    const kind = 'New Order'
    const subject = <Link href={href}>{reference}</Link>

    let summary = []
    if (country) summary.push('Export to ', country)
    if (adviser) summary.push(' added by ', adviser.name)

    return isOverview ? (
      <ActivityCardWrapper dataTest="omis-activity-summary">
        <ActivityOverviewSummary
          activity={activity}
          date={date}
          kind={kind}
          url={href}
          subject={subject}
          summary={summary}
        ></ActivityOverviewSummary>
      </ActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="order-activity">
        <ActivityCardLabels theme="Orders (OMIS)" service="Event" kind={kind} />
        <ActivityCardSubject dataTest="order-activity-card-subject">
          {subject}
        </ActivityCardSubject>
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import { get } from 'lodash'

import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'

import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

const { formatDate, DATE_FORMAT_COMPACT } = require('../../../utils/date-utils')

export default class MaxemailCampaign extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.MaxemailCampaign)
  }

  render() {
    const { activity } = this.props
    const published = get(activity, 'object.published')
    const name = get(activity, 'actor.name')
    const from = get(activity, 'actor.dit:emailAddress')
    const emailSubject = get(activity, 'object.dit:emailSubject')
    const contacts = get(activity, 'object.contacts')
    const content = get(activity, 'object.content')

    const recipients = contacts?.map((contact, index) => (
      <>
        {index ? ', ' : ''}
        <Link href={contact.url}>{contact.name}</Link>
      </>
    ))

    const metadata = [
      { label: 'Date', value: formatDate(published, DATE_FORMAT_COMPACT) },
      { label: 'Senders name', value: name },
      { label: 'Senders email', value: from },
      { label: 'Content', value: content },
      { label: 'Recipients', value: recipients },
    ]

    return (
      <ActivityCardWrapper dataTest="maxemail-campaign-activity">
        <ActivityCardSubject dataTest="maxemail-campaign-activity-card-subject">
          {emailSubject}
        </ActivityCardSubject>
        <ActivityCardLabels kind="Email Campaign" />
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    )
  }
}

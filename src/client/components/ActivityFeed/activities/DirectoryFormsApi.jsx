import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Link from '@govuk-react/link'

import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

import { format } from '../../../utils/date'
import OverviewActivityCardWrapper from './card/OverviewActivityCardWrapper'

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi)
  }

  render() {
    const { activity, isOverview } = this.props

    let kind = 'Interaction'

    // ESS index to extract id from ESS string feed by activity-stream
    // e.g. dit:directoryFormsApi:Submission:89321:create
    const ESS_ID_INDEX = 3
    const essId = activity.object.id.split(':')[ESS_ID_INDEX]
    const formType = get(activity, 'object.attributedTo.[0].id')
    const sentDate = get(activity, 'object.published')
    const formData = get(
      activity,
      'object.dit:directoryFormsApi:Submission:Data'
    )

    //if export support submission
    if (
      formType === 'dit:directoryFormsApi:SubmissionType:export-support-service'
    ) {
      const natureOfEnquiry = formData.nature_of_enquiry
        ? formData.nature_of_enquiry
        : 'ESS Inbound Enquiry'

      const contacts = CardUtils.getContacts(activity)
      const formattedContacts = () =>
        contacts &&
        contacts.map((contact, index) =>
          isOverview ? (
            index ? (
              `, `
            ) : (
              `` + `${contact.name}`
            )
          ) : (
            <span key={`contact-link-${index}`}>
              {index ? ', ' : ''}
              <Link data-test={`contact-link-${index}`} href={contact.url}>
                {contact.name}
              </Link>
            </span>
          )
        )
      const metadata = [
        { label: 'Date', value: format(sentDate) },
        {
          label: 'Contact(s)',
          value: formattedContacts(),
        },
      ]

      const url = `/interactions/ess/${essId}/details`

      const subject = <Link href={url}>{natureOfEnquiry}</Link>

      //Mapping from https://github.com/uktrade/export-support/blob/93fb921e33f0f49c5cecc0b9c18579941a384ad7/export_support/core/forms.py
      return isOverview ? (
        <OverviewActivityCardWrapper dataTest="export-support-service-summary">
          <ActivityOverviewSummary
            activity={activity}
            date={format(sentDate)}
            kind={kind}
            url={url}
            subject={subject}
            summary={`Enquirer ` + formattedContacts()}
          ></ActivityOverviewSummary>
        </OverviewActivityCardWrapper>
      ) : (
        <ActivityCardWrapper dataTest="export-support-service">
          <ActivityCardSubject dataTest="export-support-service-name">
            {subject}
          </ActivityCardSubject>
          <ActivityCardLabels
            theme="export"
            service="Export Support Service"
            kind={kind}
          />
          <ActivityCardMetadata metadata={metadata} />
        </ActivityCardWrapper>
      )
    }
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Link from '@govuk-react/link'

import { ACTIVITY_TYPE } from '../constants'
import CardUtils from './card/CardUtils'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardNotes from './card/ActivityCardNotes'
import ActivityCardMetadata from './card/ActivityCardMetadata'

import { format } from '../../../utils/date'

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi)
  }

  render() {
    const { activity } = this.props

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
        contacts.map((contact, index) => (
          <span key={`contact-link-${index}`}>
            {index ? ', ' : ''}
            <Link data-test={`contact-link-${index}`} href={contact.url}>
              {contact.name}
            </Link>
          </span>
        ))
      const metadata = [
        { label: 'Date', value: format(sentDate) },
        {
          label: 'Contact(s)',
          value: formattedContacts(),
        },
      ]

      //Mapping from https://github.com/uktrade/export-support/blob/93fb921e33f0f49c5cecc0b9c18579941a384ad7/export_support/core/forms.py
      return (
        <ActivityCardWrapper dataTest="export-support-service">
          <ActivityCardLabels
            theme="export"
            service="Export Support Service"
            kind="Interaction"
          />
          <ActivityCardSubject dataTest="export-support-service-name">
            {natureOfEnquiry}
          </ActivityCardSubject>
          <ActivityCardMetadata metadata={metadata} />
        </ActivityCardWrapper>
      )
    } else {
      const metadata = [
        { label: 'Date', value: format(sentDate) },
        {
          label: 'Name',
          value: `${formData.first_name} ${formData.last_name}`,
        },
        { label: 'Job title', value: formData.position },
        { label: 'Email', value: formData.email },
      ]
      return (
        <ActivityCardWrapper>
          <ActivityCardLabels
            theme="great.gov.uk"
            service="export"
            kind="great.gov.uk Enquiry"
          />
          <ActivityCardSubject>Enquiry</ActivityCardSubject>
          <ActivityCardNotes notes={formData.comment} />
          <ActivityCardMetadata metadata={metadata} />
        </ActivityCardWrapper>
      )
    }
  }
}
    //if export support submission
    if (
      formType === 'dit:directoryFormsApi:SubmissionType:export-support-service'
    ) {
      const metadata = [{ label: 'Date', value: format(sentDate) }]
      return (
        <ActivityCardWrapper dataTest="export-service-support">
          <ActivityCardLabels
            theme="export"
            service="Export Service Support"
            kind="Interaction"
          />
          <ActivityCardSubject dataTest="export-service-support-name">
            {formData.enquiry_subject}
          </ActivityCardSubject>
          <ActivityCardNotes notes={formData.nature_of_enquiry} />
          <ActivityCardMetadata metadata={metadata} />
        </ActivityCardWrapper>
      )
    } else {
      const metadata = [
        { label: 'Date', value: format(sentDate) },
        {
          label: 'Name',
          value: `${formData.first_name} ${formData.last_name}`,
        },
        { label: 'Job title', value: formData.position },
        { label: 'Email', value: formData.email },
      ]
      return (
        <ActivityCardWrapper>
          <ActivityCardLabels
            theme="great.gov.uk"
            service="export"
            kind="great.gov.uk Enquiry"
          />
          <ActivityCardSubject>Enquiry</ActivityCardSubject>
          <ActivityCardNotes notes={formData.comment} />
          <ActivityCardMetadata metadata={metadata} />
        </ActivityCardWrapper>
      )
    }
  }
}

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

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
    const sentDate = get(activity, 'object.published')
    const formData = get(
      activity,
      'object.dit:directoryFormsApi:Submission:Data'
    )

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

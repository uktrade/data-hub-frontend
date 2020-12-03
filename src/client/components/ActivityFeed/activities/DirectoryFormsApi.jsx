import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import { Card, CardDetails, CardHeader, CardTable } from './card'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'
import CardUtils from './card/CardUtils'

const FORM_URL_TO_NAME_MAP = {
  '/contact/export-advice/comment/': 'Export enquiry',
}

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity, filter, isExportEnquiriesEnabled) {
    return (
      CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi) &&
      isExportEnquiriesEnabled
    )
  }

  render() {
    const { activity, showDetails } = this.props
    const sentDate = get(activity, 'object.published')
    const formData = get(
      activity,
      'object.dit:directoryFormsApi:Submission:Data'
    )
    const formUrl = get(activity, 'object.url')

    return (
      <Card>
        <CardHeader
          subHeading={FORM_URL_TO_NAME_MAP[formUrl]}
          blockText="Great.gov.uk"
          startTime={sentDate}
          sourceType={SOURCE_TYPES.external}
          badge={{ text: 'GREAT.GOV.UK', borderColour: '#006435' }}
        />

        <CardDetails
          summary="View key details for this enquiry"
          showDetails={showDetails}
        >
          <CardTable
            rows={[
              { header: 'Comment', content: formData.comment },
              {
                header: 'Name',
                content: `${formData.first_name} ${formData.last_name}`,
              },
              { header: 'Position', content: formData.position },
              { header: 'Email', content: formData.email },
            ]}
          />
        </CardDetails>
      </Card>
    )
  }
}

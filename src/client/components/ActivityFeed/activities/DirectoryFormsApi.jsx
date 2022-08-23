import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import styled from 'styled-components'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import { Card, CardDetails, CardHeader, CardTable } from './card'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'
import CardUtils from './card/CardUtils'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { COMPANY_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

import { format } from '../../../utils/date'

const FORM_URL_TO_NAME_MAP = {
  '/contact/export-advice/comment/': 'Export enquiry',
}

export default class DirectoryFormsApi extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.DirectoryFormsApi)
  }

  render() {
    const { activity, showDetails } = this.props
    const sentDate = get(activity, 'object.published')
    const formData = get(
      activity,
      'object.dit:directoryFormsApi:Submission:Data'
    )
    const formUrl = get(activity, 'object.url')

    const Notes = styled('div')`
      font-size: ${FONT_SIZE.SIZE_16};
      font-weight: ${FONT_WEIGHTS.regular};
      line-height: ${FONT_SIZE.SIZE_24};
      margin-bottom: ${SPACING.SCALE_1};
    `
    const MAX_NOTE_LENGTH = 255

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
      <CheckUserFeatureFlag userFeatureFlagName={COMPANY_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
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
                summaryVisuallyHidden={` on great.gov.uk, sent on ${format(
                  sentDate
                )}`}
                showDetails={showDetails}
              >
                <CardTable
                  rows={[
                    {
                      header: 'Comment',
                      content: formData.comment,
                      hasReadmore: true,
                    },
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
          ) : (
            <ActivityCardWrapper>
              <ActivityCardLabels
                theme="great.gov.uk"
                service="export"
                kind="great.gov.uk Enquiry"
              />
              <ActivityCardSubject>Enquiry</ActivityCardSubject>
              <Notes data-test="interaction-notes">
                {formData.comment.length < MAX_NOTE_LENGTH
                  ? formData.comment
                  : formData.comment
                      .slice(0, MAX_NOTE_LENGTH)
                      .split(' ')
                      .slice(0, -1)
                      .join(' ') + ' ...'}{' '}
              </Notes>
              <ActivityCardMetadata metadata={metadata} />
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}

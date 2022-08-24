import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import {
  Card,
  CardDetails,
  CardDetailsList,
  CardHeader,
  CardTable,
} from './card'
import { ACTIVITY_TYPE, SOURCE_TYPES } from '../constants'
import CardUtils from './card/CardUtils'

import { ContactItemRenderer } from './card/item-renderers'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { COMPANY_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'

export default class MaxemailCampaign extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return (
      CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.MaxemailCampaign) &&
      CardUtils.hasMaxemailContent(activity)
    )
  }

  render() {
    const { activity, showDetails } = this.props
    const published = get(activity, 'published')
    const name = get(activity, 'actor.name')
    const from = get(activity, 'actor.dit:emailAddress')
    const emailSubject = get(activity, 'object.dit:emailSubject')
    const contacts = get(activity, 'object.contacts')
    const content = get(activity, 'object.content')

    return (
      <CheckUserFeatureFlag userFeatureFlagName={COMPANY_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
            <Card>
              <CardHeader
                heading={emailSubject}
                blockText="Email Campaign"
                startTime={published}
                sourceType={SOURCE_TYPES.external}
              />

              <CardDetails
                summary="View details of this campaign"
                summaryVisuallyHidden={` ${emailSubject}`}
                showDetails={showDetails}
              >
                <CardTable
                  rows={[
                    { header: 'Senders name', content: name },
                    { header: 'Senders email', content: from },
                    { header: 'Content', content },
                    {
                      header: 'Recipients',
                      content: (
                        <CardDetailsList
                          itemPropName="email"
                          itemRenderer={ContactItemRenderer}
                          items={contacts}
                        />
                      ),
                    },
                  ]}
                />
              </CardDetails>
            </Card>
          ) : (
            <ActivityCardWrapper dataTest="maxemail-campaign-activity">
              <ActivityCardLabels kind="Email Campaign" />
              <h3>Email Campaign</h3>
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}

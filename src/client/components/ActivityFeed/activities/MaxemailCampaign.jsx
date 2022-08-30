import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'
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
import { CONTACT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

const { format } = require('../../../utils/date')

export default class MaxemailCampaign extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  }

  static canRender(activity) {
    return (
      CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.MaxemailCampaign) &&
      get(activity, 'object.contacts').length
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

    const metadata = [
      { label: 'Date', value: format(published) },
      { label: 'Senders name', value: name },
      { label: 'Senders email', value: from },
      { label: 'Content', value: content },
      {
        label: 'Recipients',
        value: contacts.map((contact, index) => (
          <>
            {index ? ', ' : ''}
            <Link href={contact.url}>{contact.name}</Link>
          </>
        )),
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

    return (
      <CheckUserFeatureFlag userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}>
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
              <Row>
                <LeftCol>
                  <ActivityCardSubject>{emailSubject}</ActivityCardSubject>
                  <ActivityCardMetadata metadata={metadata} />
                </LeftCol>
                <RightCol>
                  <ActivityCardLabels kind="Email Campaign" />
                </RightCol>
              </Row>
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}

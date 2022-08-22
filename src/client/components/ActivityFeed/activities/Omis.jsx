import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import {
  Card,
  CardDetails,
  CardHeader,
  CardTable,
  CardDetailsList,
} from './card'

import { AdviserItemRenderer, ContactItemRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE, ANALYTICS_ACCORDION_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { COMPANY_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

const { format } = require('../../../utils/date')

export default class Omis extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Omis)
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props

    const company = CardUtils.getCompany(activity)
    const published = get(activity, 'published')
    const reference = get(activity, 'object.name')
    const country = get(activity, 'object.dit:country.name')
    const ukRegion = get(activity, 'object.dit:ukRegion.name')
    const url = get(activity, 'object.url')
    const adviser = CardUtils.getAdviser(activity)
    const contacts = CardUtils.getContacts(activity)

    const metadata = [
      { label: 'Date', value: format(published) },
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

    return (
      <CheckUserFeatureFlag userFeatureFlagName={COMPANY_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
            <Card>
              <CardHeader
                company={showDnbHierarchy ? company : null}
                heading={<Link href={url}>{reference}</Link>}
                startTime={published}
                blockText="New Order (OMIS) added"
              />

              <CardDetails
                summary="View key details and people for this order"
                summaryVisuallyHidden={` reference ${reference}`}
                showDetails={showDetails}
                analyticsAccordionType={
                  ANALYTICS_ACCORDION_TYPE.DATA_HUB_ACTIVITY
                }
              >
                <CardTable
                  rows={[
                    { header: 'Country', content: country },
                    { header: 'UK region', content: ukRegion },
                    {
                      header: 'Added by',
                      content: adviser ? (
                        <CardDetailsList
                          itemRenderer={AdviserItemRenderer}
                          items={[adviser]}
                        />
                      ) : null,
                    },
                    {
                      header: 'Company contact(s)',
                      content: (
                        <CardDetailsList
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
            <ActivityCardWrapper dataTest="order-activity">
              <ActivityCardLabels
                theme="Orders (OMIS)"
                service="Event"
                kind="New Order"
              />
              <ActivityCardSubject>{reference}</ActivityCardSubject>
              <ActivityCardMetadata metadata={metadata} />
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}

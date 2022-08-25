import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import {
  Card,
  CardDetails,
  CardHeader,
  CardTable,
  CardDetailsList,
} from './card'

import {
  ContactItemRenderer,
  AdviserActivityRenderer,
  AdviserItemRenderer,
} from './card/item-renderers'
import { ACTIVITY_TYPE, ANALYTICS_ACCORDION_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import InteractionUtils from './InteractionUtils'
import { formatMediumDate } from '../../../utils/date'

import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardNotes from './card/ActivityCardNotes'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { CONTACT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'

export default class Interaction extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Interaction)
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props
    const transformed = {
      ...CardUtils.transform(activity),
      ...InteractionUtils.transform(activity),
    }

    const company = showDnbHierarchy && CardUtils.getCompany(activity)
    const contacts = CardUtils.getContacts(activity)
    const advisers = CardUtils.getAdvisers(activity)

    const activityObject = activity.object
    const date = formatMediumDate(activityObject.startTime)
    const communicationChannel = transformed.communicationChannel

    const theme = transformed.themeText
    const service = transformed.serviceText
    const kind = transformed.typeText

    const serviceName = activityObject['dit:service']?.name
    const serviceNotes = activityObject.content

    const formattedAdvisers = () => {
      return (
        !!advisers.length &&
        advisers.map((adviser) => (
          <span key={adviser.name}>
            <AdviserActivityRenderer adviser={adviser} />
          </span>
        ))
      )
    }

    const metadata = [
      { label: 'Date', value: date },
      { label: 'Communication channel', value: communicationChannel },
      { label: 'Adviser(s)', value: formattedAdvisers() },
      {
        label: 'Service',
        value: serviceName,
      },
    ]

    return (
      <CheckUserFeatureFlag userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
            <Card isUpcoming={transformed.isUpcoming}>
              <CardHeader
                company={showDnbHierarchy ? company : null}
                heading={
                  <Link href={transformed.url}>{transformed.subject}</Link>
                }
                startTime={transformed.startTime}
                badge={transformed.badge}
              />
              <CardDetails
                summary={`View ${transformed.typeText} details`}
                summaryVisuallyHidden={` for ${transformed.subject}`}
                link={{
                  url: transformed.url,
                  text: `You can view more on the ${transformed.typeText} detail page`,
                }}
                showDetails={showDetails}
                analyticsAccordionType={
                  ANALYTICS_ACCORDION_TYPE.DATA_HUB_ACTIVITY
                }
              >
                <CardTable
                  rows={[
                    {
                      header: 'Company contact(s)',
                      content: (
                        <CardDetailsList
                          itemRenderer={ContactItemRenderer}
                          items={contacts}
                        />
                      ),
                    },
                    {
                      header: 'Adviser(s)',
                      content: (
                        <CardDetailsList
                          itemRenderer={AdviserItemRenderer}
                          items={advisers}
                        />
                      ),
                    },
                    { header: 'Services', content: transformed.service },
                  ]}
                />
              </CardDetails>
            </Card>
          ) : (
            <ActivityCardWrapper dataTest="interaction-activity">
              <ActivityCardLabels theme={theme} service={service} kind={kind} />
              <ActivityCardSubject>
                <Link data-test="interaction-subject" href={transformed.url}>
                  {transformed.subject}
                </Link>
              </ActivityCardSubject>
              {serviceNotes && <ActivityCardNotes notes={serviceNotes} />}
              <ActivityCardMetadata metadata={metadata} />
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}

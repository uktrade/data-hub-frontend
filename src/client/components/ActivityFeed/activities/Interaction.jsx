import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import {
  Card,
  CardDetails,
  CardHeader,
  CardTable,
  CardDetailsList,
} from './card'

import { ContactItemRenderer, AdviserItemRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import InteractionUtils from './InteractionUtils'
import { FONT_SIZE } from '@govuk-react/constants'
import { GREY_1 } from 'govuk-colours'
import { formatMediumDate } from '../../../utils/date'

export default class Interaction extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
    isContactActivitiesFeatureOn: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Interaction)
  }

  render() {
    const {
      activity,
      showDetails,
      showDnbHierarchy,
      isContactActivitiesFeatureOn,
    } = this.props
    const transformed = {
      ...CardUtils.transform(activity),
      ...InteractionUtils.transform(activity),
    }

    const company = showDnbHierarchy && CardUtils.getCompany(activity)
    const contacts = CardUtils.getContacts(activity)
    const advisers = CardUtils.getAdvisers(activity)

    const date = formatMediumDate(activity.object.startTime)

    const dummyActivityData = [
      { label: 'Date', value: date },
      { label: 'Communication channel', value: 'Email' },
      { label: 'Adviser(s)', value: 'Dolly Parton' },
      {
        label: 'Service',
        value:
          'A Specific DIT Export Service or Funding : European Regional Development Fund (ERDF)',
      },
    ]

    const StyledInteractionActivity = styled('div')`
      color: ${GREY_1};
      font-size: ${FONT_SIZE.SIZE_16};
      line-height: ${FONT_SIZE.SIZE_24};
    `

    const InteractionActivity = ({ rows }) => (
      <div data-test="interaction-activity">
        {rows.map(({ label, value }) => (
          <StyledInteractionActivity>
            {label}: {value}
          </StyledInteractionActivity>
        ))}
      </div>
    )

    return isContactActivitiesFeatureOn ? (
      <InteractionActivity rows={dummyActivityData} />
    ) : (
      <Card isUpcoming={transformed.isUpcoming}>
        <CardHeader
          company={showDnbHierarchy ? company : null}
          heading={<Link href={transformed.url}>{transformed.subject}</Link>}
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
    )
  }
}

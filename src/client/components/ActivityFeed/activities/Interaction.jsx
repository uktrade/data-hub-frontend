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

import {
  ContactItemRenderer,
  AdviserActivityRenderer,
  AdviserItemRenderer,
} from './card/item-renderers'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import InteractionUtils from './InteractionUtils'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { BLUE, GREY_1 } from 'govuk-colours'
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

    const activityObject = activity.object
    const date = formatMediumDate(activityObject.startTime)
    const serviceName = activityObject['dit:service'].name
    const serviceNotes =
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    const MAX_NOTE_LENGTH = 255

    const formattedAdvisers = () => {
      return advisers.map((adviser) => <>{AdviserActivityRenderer(adviser)}</>)
    }

    const metadata = [
      { label: 'Date', value: date },
      { label: 'Communication channel', value: 'Email' },
      { label: 'Adviser(s)', value: formattedAdvisers() },
      {
        label: 'Service',
        value: serviceName,
      },
    ]

    const StyledMetadata = styled('div')`
      color: ${GREY_1};
      font-size: ${FONT_SIZE.SIZE_14};
      line-height: ${FONT_SIZE.SIZE_24};
    `

    const StyledSubject = styled('H3')`
      font-size: ${FONT_SIZE.SIZE_20};
      font-weight: ${FONT_WEIGHTS.bold};
      line-height: ${FONT_SIZE.SIZE_24};
      margin-bottom: ${SPACING.SCALE_2};
      & > a:link,
      a:visited,
      a:hover,
      a:active {
        text-decoration: none;
        color: ${BLUE};
      }
    `

    const StyledNotes = styled('div')`
      font-size: ${FONT_SIZE.SIZE_16};
      font-weight: ${FONT_WEIGHTS.regular};
      line-height: ${FONT_SIZE.SIZE_24};
      margin-bottom: ${SPACING.SCALE_1};
    `

    const InteractionActivity = () => (
      <div data-test="interaction-activity">
        <StyledSubject>
          <Link href={transformed.url}>{transformed.subject}</Link>
        </StyledSubject>
        {serviceNotes && (
          <StyledNotes>
            {serviceNotes.length < MAX_NOTE_LENGTH
              ? serviceNotes
              : serviceNotes
                  .slice(0, MAX_NOTE_LENGTH)
                  .split(' ')
                  .slice(0, -1)
                  .join(' ') + ' ...'}{' '}
          </StyledNotes>
        )}
        {metadata.map(({ label, value }) => (
          <StyledMetadata>
            <span>{label}:</span> {value}
          </StyledMetadata>
        ))}
      </div>
    )

    return isContactActivitiesFeatureOn ? (
      <InteractionActivity />
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

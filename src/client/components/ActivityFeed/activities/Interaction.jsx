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
import { GREY_1 } from 'govuk-colours'
import { formatMediumDate } from '../../../utils/date'
import Tag from '../../Tag'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardWrapper from './card/ActivityCardWrapper'

const Metadata = styled('div')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_14};
  line-height: ${FONT_SIZE.SIZE_24};
`

const Notes = styled('div')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.regular};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-bottom: ${SPACING.SCALE_1};
`

const TagRow = styled('div')`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${SPACING.SCALE_2};
  margin-right: ${SPACING.SCALE_1};
`

const TagColumn = styled('div')`
  display: flex;
`

const StyledThemeTag = styled(Tag)`
  margin-right: ${SPACING.SCALE_1};
`

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
    const communicationChannel = transformed.communicationChannel

    const theme = transformed.themeText
    const service = transformed.serviceText
    const kind = transformed.typeText

    const serviceName = activityObject['dit:service']?.name
    const serviceNotes = activityObject.content
    const MAX_NOTE_LENGTH = 255

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

    const InteractionActivity = () => (
      <ActivityCardWrapper dataTest="interaction-activity">
        <TagRow>
          <TagColumn>
            {theme && (
              <StyledThemeTag
                data-test="interaction-activity-theme-label"
                colour="default"
              >
                {theme}
              </StyledThemeTag>
            )}
            {service && (
              <Tag data-test="interaction-activity-service-label" colour="blue">
                {service}
              </Tag>
            )}
          </TagColumn>
          <TagColumn>
            <Tag data-test="interaction-activity-kind-label" colour="grey">
              {kind}
            </Tag>
          </TagColumn>
        </TagRow>
        <ActivityCardSubject>
          <Link href={transformed.url}>{transformed.subject}</Link>
        </ActivityCardSubject>
        {serviceNotes && (
          <Notes>
            {serviceNotes.length < MAX_NOTE_LENGTH
              ? serviceNotes
              : serviceNotes
                  .slice(0, MAX_NOTE_LENGTH)
                  .split(' ')
                  .slice(0, -1)
                  .join(' ') + ' ...'}{' '}
          </Notes>
        )}
        <Metadata>
          {metadata.map(
            ({ label, value }, index) =>
              value && (
                <div key={`${label}-${index}`}>
                  <span style={{ fontWeight: 'bold' }}>{label}:</span> {value}
                </div>
              )
          )}
        </Metadata>
      </ActivityCardWrapper>
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

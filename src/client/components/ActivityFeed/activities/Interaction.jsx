import React from 'react'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'
import styled from 'styled-components'

import { AdviserActivityRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import InteractionUtils from './InteractionUtils'
import { formatMediumDate } from '../../../utils/date'

import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardMetadata from './card/ActivityCardMetadata'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardNotes from './card/ActivityCardNotes'
import ActivityOverviewSummary from './card/item-renderers/ActivityOverviewSummary'

export default class Interaction extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.Interaction)
  }

  render() {
    const { activity, isOverview } = this.props
    const transformed = {
      ...CardUtils.transform(activity),
      ...InteractionUtils.transform(activity),
    }
    const advisers = CardUtils.getAdvisers(activity)
    const contacts = CardUtils.getContacts(activity)
    const activityObject = activity.object
    const date = formatMediumDate(activityObject.startTime)
    const communicationChannel = transformed.communicationChannel

    const theme = transformed.themeText
    const service = transformed.serviceText
    const kind = transformed.typeText

    const serviceName = activityObject['dit:service']?.name
    const serviceNotes = activityObject.content

    const formattedAdvisers = () =>
      !!advisers.length &&
      advisers.map((adviser) =>
        isOverview ? (
          `${adviser.name}` + (adviser.team ? `, ${adviser.team}` : ``)
        ) : (
          <span key={adviser.name}>
            <AdviserActivityRenderer
              adviser={adviser}
              isOverview={isOverview}
            />
          </span>
        )
      )

    const subject = (
      <Link data-test="interaction-subject" href={transformed.interactionUrl}>
        {transformed.subject}
      </Link>
    )

    const formattedContactUrl = (contact) => {
      return `/${contact.url.split('/').slice(3).join('/')}/details`
    }

    const formattedContacts = () =>
      !!contacts.length &&
      contacts.map((contact, index) =>
        isOverview ? (
          index ? (
            `, `
          ) : (
            `` + `${contact.name}`
          )
        ) : (
          <span key={contact.name}>
            {index ? ', ' : ''}
            <Link
              data-test={`contact-link-${index}`}
              href={formattedContactUrl(contact)}
            >
              {contact.name}
            </Link>
          </span>
        )
      )

    const metadata = [
      { label: 'Date', value: date },
      { label: 'Contact(s)', value: formattedContacts() },
      { label: 'Communication channel', value: communicationChannel },
      { label: 'Adviser(s)', value: formattedAdvisers() },
      {
        label: 'Service',
        value: serviceName,
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
    return isOverview ? (
      <ActivityCardWrapper dataTest="interaction-activity-summary">
        <ActivityOverviewSummary
          activity={activity}
          date={date}
          kind={kind}
          subject={subject}
          summary={
            formattedAdvisers() +
            ` had ` +
            communicationChannel?.toLowerCase() +
            ' contact with ' +
            formattedContacts()
          }
        ></ActivityOverviewSummary>
      </ActivityCardWrapper>
    ) : theme || service ? (
      <ActivityCardWrapper dataTest="interaction-activity">
        <ActivityCardSubject>{subject}</ActivityCardSubject>
        <ActivityCardLabels theme={theme} service={service} kind={kind} />
        {serviceNotes && <ActivityCardNotes notes={serviceNotes} />}
        <ActivityCardMetadata metadata={metadata} />
      </ActivityCardWrapper>
    ) : (
      <ActivityCardWrapper dataTest="interaction-activity">
        <Row>
          <LeftCol>
            <ActivityCardSubject>{subject}</ActivityCardSubject>
            {serviceNotes && <ActivityCardNotes notes={serviceNotes} />}
            <ActivityCardMetadata metadata={metadata} />
          </LeftCol>
          <RightCol>
            <ActivityCardLabels kind={kind} />
          </RightCol>
        </Row>
      </ActivityCardWrapper>
    )
  }
}

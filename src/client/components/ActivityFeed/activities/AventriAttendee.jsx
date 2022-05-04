import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import { GREY_1 } from 'govuk-colours'
import { format } from '../../../utils/date'
import styled from 'styled-components'
import Tag from '../../Tag'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardSubject from './card/ActivityCardSubject'

const Metadata = styled('div')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_14};
  line-height: ${FONT_SIZE.SIZE_24};
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

const transformAventriAttendee = (activity) => {
  return {
    eventName: activity.eventName,
    startDate: format(activity.startDate),
  }
}
export default function AventriAttendee({ activity }) {
  const { eventName, startDate } = transformAventriAttendee(activity)

  return (
    <ActivityCardWrapper dataTest="aventri-activity">
      <TagRow>
        <TagColumn>
          <Tag data-test="aventri-event-label" colour="blue">
            Events
          </Tag>
        </TagColumn>
        <TagColumn>
          <Tag data-test="aventri-kind-label" colour="grey">
            Aventri Service Delivery
          </Tag>
        </TagColumn>
      </TagRow>
      <ActivityCardSubject>{eventName}</ActivityCardSubject>
      <Metadata>Date: {startDate || 'Unknown'}</Metadata>
    </ActivityCardWrapper>
  )
}

AventriAttendee.propTypes = {
  activity: PropTypes.object.isRequired,
}

AventriAttendee.canRender = (activity) => {
  return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.AventriAttendee)
}

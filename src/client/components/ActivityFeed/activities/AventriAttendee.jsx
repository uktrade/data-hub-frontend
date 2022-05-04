import React from 'react'
import PropTypes from 'prop-types'
import CardUtils from './card/CardUtils'
import { ACTIVITY_TYPE } from '../constants'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import { GREY_1, GREY_2 } from 'govuk-colours'
import { format } from '../../../utils/date'
import styled from 'styled-components'
import Tag from '../../Tag'

const ItemWrapper = styled('div')`
  border-bottom: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_3} 0;
`

const EventName = styled('h3')`
  color: ${GREY_1};
  font-size: ${FONT_SIZE.SIZE_20};
  font-weight: ${FONT_WEIGHTS.bold};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

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
    <ItemWrapper data-test={'aventri-activity'}>
      <TagRow>
        <TagColumn>
          <Tag colour="blue">Events</Tag>
        </TagColumn>
        <TagColumn>
          <Tag colour="grey">Aventri Service Delivery</Tag>
        </TagColumn>
      </TagRow>
      <EventName>{eventName}</EventName>
      <Metadata>Date: {startDate || 'Unknown'}</Metadata>
    </ItemWrapper>
  )
}

AventriAttendee.propTypes = {
  activity: PropTypes.object.isRequired,
}

AventriAttendee.canRender = (activity) => {
  return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.AventriAttendee)
}

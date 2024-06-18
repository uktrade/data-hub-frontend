import React from 'react'
import PropTypes from 'prop-types'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

const StyledCardNotes = styled('div')`
  font-size: ${FONT_SIZE.SIZE_16};
  font-weight: ${FONT_WEIGHTS.regular};
  line-height: ${FONT_SIZE.SIZE_24};
  margin-bottom: ${SPACING.SCALE_1};
`

const ActivityCardNotes = ({ notes, maxLength = 255 }) => (
  <StyledCardNotes data-test="activity-card-notes">
    {notes.length < maxLength
      ? notes
      : notes.slice(0, maxLength).split(' ').slice(0, -1).join(' ') +
        ' ...'}{' '}
  </StyledCardNotes>
)

ActivityCardNotes.propTypes = {
  notes: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
}

export default ActivityCardNotes

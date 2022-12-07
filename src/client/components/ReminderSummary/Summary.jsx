import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { kebabCase } from 'lodash'

import { LINK_COLOUR } from 'govuk-colours'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'

import urls from '../../../lib/urls'

const StyledReminderLink = styled('a')`
  display: inline;
  font-size: ${FONT_SIZE.SIZE_16};
  color: ${LINK_COLOUR};
`

const StyledList = styled('ul')`
  list-style-type: disc;
  padding: 0 0;
  margin: ${SPACING.SCALE_5} ${SPACING.SCALE_5};
`

const StyledListItem = styled('li')(() => ({
  margin: `${SPACING.SCALE_2} 0`,
}))

const Summary = ({ summary }) => (
  <>
    <StyledList>
      {summary &&
        summary.investment.map((reminder) => (
          <StyledListItem
            key={reminder.name}
            data-test={`investment-${kebabCase(reminder.name)}`}
          >
            <StyledReminderLink href={reminder.url}>
              {reminder.name}
            </StyledReminderLink>
            &nbsp;({reminder.count})
          </StyledListItem>
        ))}
    </StyledList>
    <StyledReminderLink href={urls.reminders.settings.index()}>
      Reminders and email notifications settings
    </StyledReminderLink>
  </>
)

const reminderType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })
)

Summary.propTypes = {
  count: PropTypes.number,
  investment: reminderType,
}

export default Summary

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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

const typeToReminderName = {
  estimated_land_date: 'Approaching estimated land dates',
  no_recent_investment_interaction: 'Projects with no recent interaction',
  outstanding_propositions: 'Outstanding propositions',
}

const typeToURL = {
  estimated_land_date: urls.reminders.estimatedLandDate(),
  no_recent_investment_interaction: urls.reminders.noRecentInteraction(),
  outstanding_propositions: urls.reminders.outstandingPropositions(),
}

const Summary = ({ summary }) => {
  return (
    <>
      <StyledList>
        {Object.entries(summary).map(([type, number]) => (
          <StyledListItem key={type} data-test={`summary-item-${type}`}>
            <StyledReminderLink href={typeToURL[type]}>
              {typeToReminderName[type]}
            </StyledReminderLink>
            &nbsp;({number})
          </StyledListItem>
        ))}
      </StyledList>
      <StyledReminderLink href={urls.reminders.settings.index()}>
        Reminders and email notifications settings
      </StyledReminderLink>
    </>
  )
}

Summary.propTypes = {
  summary: PropTypes.shape({
    estimated_land_date: PropTypes.number.isRequired,
    no_recent_investment_interaction: PropTypes.number.isRequired,
    outstanding_propositions: PropTypes.number.isRequired,
  }),
}

export default Summary

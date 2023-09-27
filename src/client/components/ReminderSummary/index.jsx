import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { kebabCase } from 'lodash'
import { H5 } from '@govuk-react/heading'
import { FONT_SIZE, SPACING, FONT_WEIGHTS } from '@govuk-react/constants'

import { LINK_COLOUR } from '../../../client/utils/colours'

import urls from '../../../lib/urls'
import { state2props } from './state'

const StyledSubHeading = styled(H5)`
  font-size: ${FONT_SIZE.SIZE_10};
  font-weight: ${FONT_WEIGHTS.bold};
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

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

const ReminderSummary = ({
  summary,
  hasInvestmentFeatureGroup,
  hasExportFeatureGroup,
}) => {
  const showInvestment = hasInvestmentFeatureGroup && !!summary
  const showExport = hasExportFeatureGroup && !!summary
  return (
    <div data-test="reminder-summary">
      {showInvestment && (
        <>
          <StyledSubHeading data-test="investment-heading">
            Investment
          </StyledSubHeading>
          <StyledList>
            {summary.investment.map((reminder) => (
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
        </>
      )}
      {showExport && (
        <>
          <StyledSubHeading data-test="export-heading">Export</StyledSubHeading>
          <StyledList>
            {summary.export.map((reminder) => (
              <StyledListItem
                key={reminder.name}
                data-test={`export-${kebabCase(reminder.name)}`}
              >
                <StyledReminderLink href={reminder.url}>
                  {reminder.name}
                </StyledReminderLink>
                &nbsp;({reminder.count})
              </StyledListItem>
            ))}
          </StyledList>
        </>
      )}
      <StyledReminderLink href={urls.reminders.settings.index()}>
        Settings: reminders and email notifications
      </StyledReminderLink>
    </div>
  )
}

const reminderType = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })
)

ReminderSummary.propTypes = {
  summary: PropTypes.shape({
    count: PropTypes.number,
    investment: reminderType,
    export: reminderType,
  }),
  hasExportFeatureGroup: PropTypes.bool.isRequired,
  hasInvestmentFeatureGroup: PropTypes.bool.isRequired,
}

export default connect(state2props)(ReminderSummary)

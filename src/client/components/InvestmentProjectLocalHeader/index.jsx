import React from 'react'
import PropTypes from 'prop-types'
import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled, { ThemeProvider } from 'styled-components'
import { upperFirst } from 'lodash'

import Timeline from '../Timeline'

import { formatMediumDateTime } from '../../utils/date'
import timelineTheme from './timeline-theme'
import urls from '../../../lib/urls'
import { INVESTMENT_PROJECT_STAGES } from '../../modules/Investments/Projects/constants'
import StatusMessage from '../StatusMessage'
import { DARK_GREY, WHITE } from '../../utils/colours'

const MetaList = styled('ul')({})

const StyledListItem = styled('li')({
  marginRight: SPACING.SCALE_5,
  display: 'inline-grid',
  '&:last-child': {
    marginTop: SPACING.SCALE_3,
    marginBottom: SPACING.SCALE_3,
  },
  [MEDIA_QUERIES.LARGESCREEN]: {
    '&:last-child': {
      marginTop: 0,
      marginBottom: 0,
    },
  },
})

const StyledListItemText = styled('span')({
  color: DARK_GREY,
  fontSize: FONT_SIZE.SIZE_16,
  fontWeight: 400,
  marginBottom: SPACING.SCALE_1,
})

const StyledChild = styled('span')({
  fontSize: FONT_SIZE.SIZE_16,
})

const StyledStatusMessage = styled(StatusMessage)({
  fontSize: FONT_SIZE.SIZE_20,
  fontWeight: 700,
  marginBottom: SPACING.SCALE_1,
  marginTop: SPACING.SCALE_2,
  backgroundColor: WHITE,
})

const MetaListItem = ({ text, children }) => (
  <StyledListItem>
    <StyledListItemText>{text}</StyledListItemText>
    <StyledChild>{children}</StyledChild>
  </StyledListItem>
)

/**
 * The **InvestmentProjectLocalHeader** contains the following:
 *
 * - Investment metadata such as: Status (Ongoing, Delayed, Abandoned, Lost and Dormant), Project code, Valuation and a Created on date
 *
 * - A list of five stages (Prospect', 'Assign PM', 'Active', 'Verify win' and 'Won') in chronological order where the current stage is clear to see
 */
const InvestmentProjectLocalHeader = ({ investment }) => (
  <>
    <MetaList data-test="meta-list">
      <MetaListItem text={'Status'}>
        {upperFirst(investment.status)} -{' '}
        <a href={urls.investments.projects.status(investment.id)}>change</a>
      </MetaListItem>
      <MetaListItem text={'Project code'}>
        {investment.projectCode}
      </MetaListItem>
      <MetaListItem text="Valuation">
        {investment.valueComplete ? 'Project valued' : 'Not yet valued'}
      </MetaListItem>
      <MetaListItem text="Created on">
        {formatMediumDateTime(investment.createdOn)}
      </MetaListItem>
      {investment.createdBy?.ditTeam?.name && (
        <MetaListItem text="Created by">
          {investment.createdBy.ditTeam.name}
        </MetaListItem>
      )}
    </MetaList>
    <ThemeProvider theme={timelineTheme}>
      <Timeline
        stages={INVESTMENT_PROJECT_STAGES}
        currentStage={investment.stage.name}
      />
    </ThemeProvider>
    {investment.stage.name === 'Won' && !investment.archived && (
      <StyledStatusMessage data-test="project-won-message">
        This project has been verified as won. You should not make any changes
        to this project.
        <br />
        <br />
        If you would like to make changes, please contact the Investment
        Promotion Performance team.
      </StyledStatusMessage>
    )}
  </>
)

InvestmentProjectLocalHeader.propTypes = {
  /**
   * An investment project
   */
  investment: PropTypes.object.isRequired,
}

export default InvestmentProjectLocalHeader

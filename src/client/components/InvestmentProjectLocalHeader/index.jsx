import React from 'react'
import PropTypes from 'prop-types'
import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled, { ThemeProvider } from 'styled-components'
import { upperFirst } from 'lodash'

import LocalHeader from '../LocalHeader/LocalHeader'
import Timeline from '../Timeline'

import { formatMediumDateTime } from '../../utils/date'
import timelineTheme from './timeline-theme'
import urls from '../../../lib/urls'
import { INVESTMENT_PROJECT_STAGES } from '../../modules/Investments/Projects/constants'

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
  color: '#6f777b',
  fontSize: FONT_SIZE.SIZE_16,
  fontWeight: 400,
  marginBottom: SPACING.SCALE_1,
})

const StyledChild = styled('span')({
  fontSize: FONT_SIZE.SIZE_16,
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
 * - A row of breadcrumbs (secondary navigation) that reveals the user's location in Data Hub
 *
 * - Investment metadata such as: Status (Ongoing, Delayed, Abandoned, Lost and Dormant), Project code, Valuation and a Created on date
 *
 * - A list of five stages (Prospect', 'Assign PM', 'Active', 'Verify win' and 'Won') in chronological order where the current stage is clear to see
 */
const InvestmentProjectLocalHeader = ({ investment, breadcrumbs }) => (
  <LocalHeader
    headingLink={{
      url: urls.companies.detail(investment.investor_company.id),
      text: investment.investor_company.name,
    }}
    heading={investment.name}
    breadcrumbs={breadcrumbs}
  >
    <MetaList data-test="meta-list">
      <MetaListItem text={'Status'}>
        {upperFirst(investment.status)} -{' '}
        <a href={urls.investments.projects.status(investment.id)}>change</a>
      </MetaListItem>
      <MetaListItem text={'Project code'}>
        {investment.project_code}
      </MetaListItem>
      <MetaListItem text="Valuation">
        {investment.value_complete ? 'Project valued' : 'Not yet valued'}
      </MetaListItem>
      <MetaListItem text="Created on">
        {formatMediumDateTime(investment.created_on)}
      </MetaListItem>
      {investment.created_by?.dit_team?.name && (
        <MetaListItem text="Created by">
          {investment.created_by.dit_team.name}
        </MetaListItem>
      )}
    </MetaList>
    <ThemeProvider theme={timelineTheme}>
      <Timeline
        stages={INVESTMENT_PROJECT_STAGES}
        currentStage={investment.stage.name}
      />
    </ThemeProvider>
  </LocalHeader>
)

InvestmentProjectLocalHeader.propTypes = {
  /**
   * An investment project
   */
  investment: PropTypes.object.isRequired,
  /**
   * An array of objects containing two fields (link and text)
   */
  breadcrumbs: PropTypes.array.isRequired,
}

export default InvestmentProjectLocalHeader

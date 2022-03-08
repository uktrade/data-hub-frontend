import React from 'react'
import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'
import styled, { ThemeProvider } from 'styled-components'
import { upperFirst } from 'lodash'

import LocalHeader from '../LocalHeader/LocalHeader'
import { Timeline } from '..'

import { formatMediumDateTime } from '../../utils/date'
import timelineTheme from './timeline-theme'
import urls from '../../../lib/urls'

export const STAGES = ['Prospect', 'Assign PM', 'Active', 'Verify win', 'Won']

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
    </MetaList>
    <ThemeProvider theme={timelineTheme}>
      <Timeline stages={STAGES} currentStage={investment.stage.name} />
    </ThemeProvider>
  </LocalHeader>
)

export default InvestmentProjectLocalHeader

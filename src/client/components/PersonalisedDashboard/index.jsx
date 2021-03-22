import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { BLUE } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { VARIANTS } from '../../../common/constants'
import { ID as INVESTMENT_REMINDERS_ID } from '../InvestmentReminders/state'

import NotificationBadge from '../NotificationBadge'
import ToggleSection from '../ToggleSection'

import Aside from './Aside'
import Main from './Main'
import blueTheme from './blue-theme'

import {
  InvestmentReminders,
  InvestmentProjectSummary,
  Search,
  DashboardTabs,
  Container,
} from '../../components'

const SearchBackground = styled('div')`
  background-color: ${BLUE};
`

const SearchContainer = styled(Container)`
  padding: ${SPACING.SCALE_2} 0;

  ${MEDIA_QUERIES.TABLET} {
    padding: ${SPACING.SCALE_3} 0;
  }

  ${MEDIA_QUERIES.DESKTOP} {
    padding: ${SPACING.SCALE_4} 0;
  }
`

const state2props = (state) => {
  const { count } = state[INVESTMENT_REMINDERS_ID]
  return {
    remindersCount: count,
  }
}

const PersonalisedDashboard = ({ id, adviser, csrfToken, remindersCount }) => (
  <ThemeProvider theme={blueTheme}>
    <SearchBackground data-test="search-data-hub">
      <SearchContainer width="960">
        <Search csrfToken={csrfToken} />
      </SearchContainer>
    </SearchBackground>
    <Container width="1180">
      <GridRow data-test="dashboard">
        <GridCol setWidth="one-third">
          <Aside>
            <ToggleSection
              label="Reminders"
              id="investment-reminders-section"
              badge={
                !!remindersCount && (
                  <NotificationBadge label={`${remindersCount}`} />
                )
              }
              major={true}
              isOpen={true}
              variant={VARIANTS.PRIMARY}
              data-test="investment-reminders-section"
            >
              <InvestmentReminders adviser={adviser} />
            </ToggleSection>

            <ToggleSection
              label="Investment project summary"
              id="investment-project-summary-section"
              isOpen={true}
              variant={VARIANTS.PRIMARY}
              data-test="investment-project-summary-section"
            >
              <InvestmentProjectSummary adviser={adviser} />
            </ToggleSection>
          </Aside>
        </GridCol>
        <GridCol setWidth="two-thirds">
          <Main>
            <DashboardTabs id={id} adviser={adviser} />
          </Main>
        </GridCol>
      </GridRow>
    </Container>
  </ThemeProvider>
)

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
  csrfToken: PropTypes.string.isRequired,
  remindersCount: PropTypes.number.isRequired,
}

export default connect(state2props)(PersonalisedDashboard)

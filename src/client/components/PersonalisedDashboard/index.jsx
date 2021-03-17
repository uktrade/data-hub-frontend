import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { BLUE } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { APPEARANCES } from '../../../common/constants'

import { OUTSTANDING_PROPOSITIONS__LOADED } from '../../actions'
import NotificationBadge from '../NotificationBadge'
import Task from '../Task'
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

import { ID, TASK_GET_OUTSTANDING_PROPOSITIONS, state2props } from './state'

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

const PersonalisedDashboard = ({
  id,
  adviser,
  outstandingPropositions,
  csrfToken,
}) => (
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
            <Task.Status
              name={TASK_GET_OUTSTANDING_PROPOSITIONS}
              id={ID}
              progressMessage="Loading your reminders"
              startOnRender={{
                payload: { adviser },
                onSuccessDispatch: OUTSTANDING_PROPOSITIONS__LOADED,
              }}
            >
              {() => (
                <ToggleSection
                  label="Reminders"
                  id="investment-reminders-section"
                  badge={
                    <NotificationBadge
                      label={`${outstandingPropositions.count}`}
                    />
                  }
                  major={true}
                  isOpen={true}
                  appearance={APPEARANCES.PRIMARY}
                  data-test="investment-reminders-section"
                >
                  <InvestmentReminders
                    outstandingPropositions={outstandingPropositions}
                  />
                </ToggleSection>
              )}
            </Task.Status>

            <ToggleSection
              label="Investment project summary"
              id="investment-project-summary-section"
              isOpen={true}
              appearance={APPEARANCES.PRIMARY}
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
  outstandingPropositions: PropTypes.shape({
    count: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        investment_project: PropTypes.shape({
          id: PropTypes.string.is_required,
          name: PropTypes.string.isRequired,
          project_code: PropTypes.string.isRequired,
        }),
        deadline: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        adviser: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          first_name: PropTypes.string.isRequired,
          last_name: PropTypes.string.isRequired,
        }),
      })
    ).isRequired,
  }),
}

export default connect(state2props)(PersonalisedDashboard)

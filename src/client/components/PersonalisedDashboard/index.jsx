import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'
import styled from 'styled-components'
import { BLUE } from 'govuk-colours'
import { MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import Aside from './Aside.jsx'
import Main from './Main.jsx'

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

const PersonalisedDashboard = ({ id, adviser, csrfToken }) => (
  <>
    <SearchBackground data-test="search-data-hub">
      <SearchContainer width="960">
        <Search csrfToken={csrfToken} />
      </SearchContainer>
    </SearchBackground>
    <Container width="1200">
      <GridRow data-test="dashboard">
        <GridCol setWidth="one-third">
          <Aside>
            <InvestmentReminders />
            <InvestmentProjectSummary adviser={adviser} />
          </Aside>
        </GridCol>
        <GridCol setWidth="two-thirds">
          <Main>
            <DashboardTabs id={id} adviser={adviser} />
          </Main>
        </GridCol>
      </GridRow>
    </Container>
  </>
)

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
  adviser: PropTypes.object.isRequired,
}

export default PersonalisedDashboard

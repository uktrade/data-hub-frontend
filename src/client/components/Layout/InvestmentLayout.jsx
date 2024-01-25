import React, { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Footer from '../Footer'
import Main from '../Main'
import DataHubHeader from '../DataHubHeader'
import { InvestmentLocalHeader } from '../../components'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

const InvestmentLayout = ({ children, ...props }) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  return (
    <>
      <GlobalStyles />f
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <InvestmentLocalHeader {...props} />
      <Main>
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Main>
      <Footer />
    </>
  )
}

InvestmentLayout.propTypes = {
  projectId: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }),
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    })
  ),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default InvestmentLayout

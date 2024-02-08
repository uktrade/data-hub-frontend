import React, { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Footer from '../Footer'
import Main from '../Main'
import DataHubHeader from '../DataHubHeader'
import { InvestmentLocalHeader } from '../../components'
import WatchTextContent from '../WatchTextContent'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

const InvestmentLayout = ({ children, pageTitle, ...props }) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  return (
    <>
      <WatchTextContent
        onTextContentChange={(text) => {
          document.title = text
        }}
      >
        {pageTitle} - DBT Data Hub
      </WatchTextContent>
      <GlobalStyles />
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
  pageTitle: PropTypes.node.isRequired,
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

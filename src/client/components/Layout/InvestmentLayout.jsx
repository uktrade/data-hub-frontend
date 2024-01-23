import React, { useEffect, useState } from 'react'
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

const InvestmentLayout = ({
  projectId,
  heading,
  pageTitle,
  flashMessages,
  breadcrumbs,
  children,
  useReactRouter = false,
  localHeaderChildren,
}) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  useEffect(() => {
    document.title = `${pageTitle} - DBT Data Hub`
  }, [pageTitle])
  return (
    <>
      <GlobalStyles />
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <InvestmentLocalHeader
        projectId={projectId}
        flashMessages={flashMessages}
        breadcrumbs={
          breadcrumbs || [{ link: '/', text: 'Home' }, { text: heading }]
        }
        useReactRouter={useReactRouter}
      >
        {localHeaderChildren}
      </InvestmentLocalHeader>
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
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  headingLink: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default InvestmentLayout

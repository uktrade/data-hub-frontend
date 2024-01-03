import React, { useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Footer from '../Footer'
import DataHubHeader from '../DataHubHeader'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

/**
 * This is a reduced version of DefaultLayout, similar to the _layout
 * template used by the old Nunjucks pages.
 */
const DefaultLayoutBase = ({ pageTitle, children }) => {
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
      <GridRow>
        <GridCol>{children}</GridCol>
      </GridRow>
      <Footer />
    </>
  )
}

DefaultLayoutBase.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  headingLink: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}

export default DefaultLayoutBase

import React, { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Footer from '../Footer'
import DataHubHeader from '../DataHubHeader'
import Hcsat from '../Hcsat'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

/**
 * This is a reduced version of DefaultLayout, similar to the _layout
 * template used by the old Nunjucks pages.
 */
const DefaultLayoutBase = ({ children }) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
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
      <Hcsat isBaseLayout={true} />
      <Footer />
    </>
  )
}

DefaultLayoutBase.propTypes = {
  children: PropTypes.element.isRequired,
}

export default DefaultLayoutBase

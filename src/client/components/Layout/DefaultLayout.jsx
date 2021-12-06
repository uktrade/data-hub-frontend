import React, { useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Footer from '../Footer'
import { Main } from '../../components'
import LocalHeader from '../LocalHeader/LocalHeader'
import DataHubHeader from '../DataHubHeader'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

const DefaultLayout = ({
  heading,
  pageTitle,
  flashMessages,
  breadcrumbs,
  children,
}) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  useEffect(() => {
    document.title = `${pageTitle} - DIT Data Hub`
  }, [pageTitle])
  return (
    <>
      <GlobalStyles />
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <LocalHeader
        heading={heading}
        flashMessages={flashMessages}
        breadcrumbs={
          breadcrumbs || [{ link: '/', text: 'Home' }, { text: heading }]
        }
      />
      <Main>
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Main>
      <Footer />
    </>
  )
}

DefaultLayout.propTypes = {
  heading: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}

export default DefaultLayout

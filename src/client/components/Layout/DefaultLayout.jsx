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
  subheading,
  pageTitle,
  flashMessages,
  breadcrumbs,
  children,
  useReactRouter = false,
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
      <LocalHeader
        heading={heading}
        subheading={subheading}
        flashMessages={flashMessages}
        breadcrumbs={
          breadcrumbs || [{ link: '/', text: 'Home' }, { text: heading }]
        }
        useReactRouter={useReactRouter}
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
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subheading: PropTypes.string,
  pageTitle: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
}

export default DefaultLayout

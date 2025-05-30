import React, { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'

import Footer from '../Footer'
import Main from '../Main'
import LocalHeader from '../LocalHeader/LocalHeader'
import DataHubHeader from '../DataHubHeader'
import WatchTextContent from '../WatchTextContent'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

const DefaultLayout = ({
  superheading,
  heading,
  headingLink,
  subheading,
  pageTitle,
  flashMessages,
  breadcrumbs,
  children,
  useReactRouter = false,
  localHeaderChildren,
  localHeader,
}) => {
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
      {localHeader ? (
        localHeader
      ) : (
        <LocalHeader
          superheading={superheading}
          heading={heading}
          headingLink={headingLink}
          subheading={subheading}
          flashMessages={flashMessages}
          breadcrumbs={
            breadcrumbs || [{ link: '/', text: 'Home' }, { text: heading }]
          }
          useReactRouter={useReactRouter}
        >
          {localHeaderChildren}
        </LocalHeader>
      )}
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
  superheading: PropTypes.node,
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  headingLink: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  pageTitle: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default DefaultLayout

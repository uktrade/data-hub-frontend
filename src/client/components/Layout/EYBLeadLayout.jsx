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
import EYBLeadName from '../../modules/Investments/EYBLeads/EYBLeadName'
import { buildEYBLeadBreadcrumbs } from '../../modules/Investments/utils'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

const EYBLeadLayout = ({
  eybLeadId,
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
}) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)

  return (
    <>
      <WatchTextContent
        onTextContentChange={(text) => {
          document.title = text
        }}
      >
        {/* {pageTitle} - <EYBLeadName id={eybLeadId} /> - EYB Leads - Investments */}
      </WatchTextContent>
      <GlobalStyles />
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <LocalHeader
        superheading={superheading}
        heading={heading}
        headingLink={headingLink}
        subheading={subheading}
        flashMessages={flashMessages}
        // breadcrumbs={buildEYBLeadBreadcrumbs(breadcrumbs)}
        useReactRouter={useReactRouter}
      >
        {localHeaderChildren}
      </LocalHeader>
      <Main>
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Main>
      <Footer />
    </>
  )
}

EYBLeadLayout.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  headingLink: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  subheading: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  pageTitle: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default EYBLeadLayout

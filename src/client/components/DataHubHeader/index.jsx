import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SkipLink } from 'govuk-react'

import DataHubBar from './DataHubBar'
import NavBar from './NavBar'

import { state2props } from './state'

const DataHubHeader = ({
  onShowVerticalNav,
  showVerticalNav,
  disableReactRouter,
  hasFeatureGroup,
}) => (
  <header id="datahub-header" role="banner">
    <SkipLink href="#main-content">Skip to main content</SkipLink>
    <DataHubBar
      onShowVerticalNav={onShowVerticalNav}
      showVerticalNav={showVerticalNav}
      hasFeatureGroup={hasFeatureGroup}
    />
    <NavBar
      onShowVerticalNav={onShowVerticalNav}
      showVerticalNav={showVerticalNav}
      disableReactRouter={disableReactRouter}
    />
  </header>
)

DataHubHeader.propTypes = {
  onShowVerticalNav: PropTypes.func.isRequired,
  showVerticalNav: PropTypes.bool.isRequired,
  disableReactRouter: PropTypes.bool,
  hasFeatureGroup: PropTypes.bool.isRequired,
}

export default connect(state2props)(DataHubHeader)

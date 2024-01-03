import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SkipLink } from 'govuk-react'

import { BLACK } from '../../../client/utils/colours'

import DataHubBar from './DataHubBar'
import NavBar from './NavBar'

import { state2props } from './state'

const Header = styled.header({
  backgroundColor: BLACK,
})

const DataHubHeader = ({
  onShowVerticalNav,
  showVerticalNav,
  disableReactRouter,
  hasFeatureGroup,
}) => (
  <Header id="datahub-header" role="banner">
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
  </Header>
)

DataHubHeader.propTypes = {
  onShowVerticalNav: PropTypes.func.isRequired,
  showVerticalNav: PropTypes.bool.isRequired,
  disableReactRouter: PropTypes.bool,
  hasFeatureGroup: PropTypes.bool.isRequired,
}

export default connect(state2props)(DataHubHeader)

import React from 'react'
import styled from 'styled-components'
import { BLACK } from 'govuk-colours'

import LogoBar from './LogoBar'
import NavButton from './NavButton'
import NavBar from './NavBar'

const Header = styled.header({
  position: 'relative',
  lineHeight: 1.5,
  backgroundColor: BLACK,
})

const DataHubHeader = ({
  onShowVerticalNav,
  showVerticalNav,
  disableReactRouter,
}) => (
  <Header id="datahub-header" role="banner">
    <LogoBar showVerticalNav={showVerticalNav}></LogoBar>
    <NavButton
      onShowVerticalNav={onShowVerticalNav}
      showVerticalNav={showVerticalNav}
    />
    <NavBar
      onShowVerticalNav={onShowVerticalNav}
      showVerticalNav={showVerticalNav}
      disableReactRouter={disableReactRouter}
    />
  </Header>
)

export default DataHubHeader

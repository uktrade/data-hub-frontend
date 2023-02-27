import React from 'react'
import PropTypes from 'prop-types'

import CompanyLocalTab from './CompanyLocalTab'
import styled from 'styled-components'

const StyledGridRow = styled.div`
  margin-right: -15px;
  margin-left: -15px;
`

const StyledGridColumn = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 15px;
  @media (min-width: 840px) {
    width: 100%;
    float: left;
  }
`
const StyledNav = styled.nav`
  margin-bottom: 15px;
  color: #0b0c0c;
  margin-top: 5px;
  @media (min-width: 840px) {
    margin-bottom: 30px;
    margin-top: 5px;
  }
`

const StyledUnorderedList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  border-bottom: none;
  @media (max-width: 839px) {
    display: block;
    padding-bottom: 20px;
    border-bottom: 0;
  }
`

const CompanyTabbedLocalNavigation = (props) => {
  const { localNavItems } = props

  return (
    <StyledGridRow>
      <StyledGridColumn>
        <StyledNav aria-label="local navigation" data-test="tabbedLocalNav">
          <StyledUnorderedList data-test="tabbedLocalNavList">
            {localNavItems?.map((navItem, index) => {
              return (
                <CompanyLocalTab
                  navItem={navItem}
                  index={index}
                  key={`company-tab-${index}`}
                />
              )
            })}
          </StyledUnorderedList>
        </StyledNav>
      </StyledGridColumn>
    </StyledGridRow>
  )
}

CompanyTabbedLocalNavigation.propTypes = {
  localNavItems: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      permissions: PropTypes.array,
      url: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      ariaDescription: PropTypes.string,
    })
  ).isRequired,
}

export default CompanyTabbedLocalNavigation

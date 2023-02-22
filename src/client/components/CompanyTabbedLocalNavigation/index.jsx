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
  @media (min-width: 40.0625em) {
    width: 100%;
    float: left;
  }
`
const StyledNav = styled.nav`
  margin-bottom: 15px;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.25;
  color: #0b0c0c;
  margin-top: 5px;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
    margin-top: 5px;
    font-size: 19px;
    font-size: 1.1875rem;
    line-height: 1.3157894737;
  }
`

const StyledUnorderedList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;

  @media (min-width: 40.0625em) {
    border-bottom: 1px solid #bfc1c3;
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

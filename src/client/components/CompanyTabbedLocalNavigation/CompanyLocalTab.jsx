import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const StyledListItem = styled.li`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  border-left-width: 1px;
  flex-grow: 1;
  text-align: center;
  white-space: nowrap;
  @media (min-width: 40.0625em) {
    margin-left: 0;
  }
  a {
    display: block;
    width: calc(100% - 5px);
  }
`

const StyledAnchorTag = styled.a`
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.25;
  padding: 10px 20px;
  margin-right: 5px;
  display: block;
  flex: 1;
  padding-right: -4px;
  padding-left: -4px;
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: black;
  }
  @media (min-width: 40.0625em) {
    margin-right: 5px;
    padding-right: 20px;
    padding-left: 20px;
    float: left;
    color: #0b0c0c;
    background-color: #f8f8f8;
    text-align: center;
    text-decoration: none;
    font-size: 19px;
    font-size: 1.1875rem;
    line-height: 1.3157894737;

    ${(props) =>
      props.selected &&
      css`
        margin: -5px, 1px, -1px, 0px;
        margin-top: -5px;
        margin-bottom: -1px;
        padding-top: 14px;
        padding-right: 19px;
        padding-bottom: 16px;
        padding-left: 19px;
        border: 1px solid #bfc1c3;
        border-bottom: 0;
        color: #0b0c0c;
        background-color: #fff;
      `}
  }
`
const CompanyLocalTab = (props) => {
  const { navItem, index } = props

  return (
    <StyledListItem key={`tab-${index}`}>
      <StyledAnchorTag
        selected={navItem.isActive}
        href={navItem.url}
        id={`tab-${navItem.path}`}
        key={`tab-link-${navItem.path}`}
        aria-label={navItem.ariaDescription}
      >
        {navItem.label}
      </StyledAnchorTag>
    </StyledListItem>
  )
}
CompanyLocalTab.propTypes = {
  navItem: PropTypes.shape({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    permissions: PropTypes.array,
    url: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    ariaDescription: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
}

export default CompanyLocalTab

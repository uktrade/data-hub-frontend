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
  text-align: center;
  border-bottom: 1px solid #bfc1c3;

  @media (min-width: 1020px) {
    white-space: nowrap;
  }
  @media (max-width: 839px) {
    text-align: left;
    margin-left: 25px;
    line-height: 2.5em;
    border-bottom: none;
    &::before {
      content: '—';
      margin-left: -25px;
      padding-right: 5px;
    }
    a {
      width: calc(100% - 5px);
    }
  }
`

const StyledAnchorTag = styled.a`
  display: inline-block;

  @media (min-width: 840px) {
    padding: 10px 20px;
    margin: 0 5px 0 0;
    &:link,
    &:visited,
    &:hover,
    &:active {
      color: black;
    }
    background-color: #f8f8f8;
    text-align: center;
    text-decoration: none;
    height: 90%;

    ${(props) =>
      props.selected &&
      css`
        margin: -5px 5px -1px 0px;
        padding-top: 14px;
        padding-right: 19px;
        padding-bottom: 16px;
        padding-left: 19px;
        border: 1px solid #bfc1c3;
        border-bottom: 0px;
        color: #0b0c0c;
        background-color: #fff;
        height: auto;
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

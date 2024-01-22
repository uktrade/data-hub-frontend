import React from 'react'
import styled from 'styled-components'

import urls from '../../../lib/urls'
import { StyledAnchorTag, StyledListItem } from './CompanyLocalTab'

const StyledTabAnchorTag = styled(StyledAnchorTag)`
  width: 100%;
`

const StyledTabListItem = styled(StyledListItem)`
  flex-grow: 1;
  max-width: 50%;
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

const StyledGridColumn = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0 15px;
  @media (min-width: 840px) {
    width: 100%;
    float: left;
  }
`

const StyledGridRow = styled.div`
  margin-right: -15px;
  margin-left: -15px;
`

const investmentNavItems = (companyId, isLCP) => [
  {
    url: urls.companies.investments.companyInvestmentProjects(companyId),
    path: '',
    label: 'Investments',
    isActive: isLCP ? false : true,
  },
  {
    url: urls.companies.investments.largeCapitalProfile(companyId),
    path: '',
    label: 'Large capital profile',
    isActive: isLCP ? true : false,
  },
]

const CompanyInvestmentTab = ({ navItem }) =>
  navItem && (
    <StyledTabListItem>
      <StyledTabAnchorTag
        selected={navItem.isActive}
        href={navItem.url}
        id={`tab-${navItem.path}`}
        key={`tab-link-${navItem.path}`}
        aria-label={navItem.ariaDescription}
      >
        {navItem.label}
      </StyledTabAnchorTag>
    </StyledTabListItem>
  )

const CompanyInvestmentSubNavigation = ({ companyId, isLCP }) => (
  <StyledGridRow>
    <StyledGridColumn>
      <StyledNav
        aria-label="investment sub navigation"
        data-test="tabbedInvestmentNav"
      >
        <StyledUnorderedList data-test="tabbedLocalNavList">
          {investmentNavItems(companyId, isLCP).map((t, index) => (
            <CompanyInvestmentTab navItem={t} index={index} key={index} />
          ))}
        </StyledUnorderedList>
      </StyledNav>
    </StyledGridColumn>
  </StyledGridRow>
)

export default CompanyInvestmentSubNavigation

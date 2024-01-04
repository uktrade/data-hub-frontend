import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Paragraph from '@govuk-react/paragraph'
import WarningText from '@govuk-react/warning-text'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'

import CompanyLocalTab from './CompanyLocalTab'
import urls from '../../../lib/urls'
import StatusMessage from '../../../client/components/StatusMessage'
import { BLACK } from '../../../client/utils/colours'
import { localNavItems } from './constants'
import { state2props } from './state'
import { filterNonPermittedItem } from '../../../modules/permissions/filters'

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

const StyledLink = styled('a')`
  margin-bottom: 0;
`

const showMatchingPrompt = (company) =>
  !company.dunsNumber && !company.pendingDnbInvestigation

const transformLocalNavItems = (navItems, userPermissions) =>
  navItems
    .filter(filterNonPermittedItem(userPermissions))
    .map((item, index) => (
      <CompanyLocalTab
        navItem={item}
        index={index}
        isActive={location.pathname.includes(item.path)}
        key={`company-tab-${index}`}
      />
    ))

const CompanyTabbedLocalNavigation = ({ company, userPermissions }) => (
  <StyledGridRow>
    {showMatchingPrompt(company) && (
      <StatusMessage colour={BLACK} id="ga-company-details-matching-prompt">
        <WarningText>
          Business details on this company record have not been verified and
          could be wrong.
        </WarningText>
        <Details summary="Why verify?">
          <Paragraph>
            Using verified business details from a trusted third-party supplier
            means we can keep certain information up to date automatically. This
            helps reduce duplicate records, provide a shared view of complex
            companies and make it more likely we can link other data sources
            together.
          </Paragraph>
          <Paragraph>
            Verification can often be done in just 4 clicks.
          </Paragraph>
        </Details>
        <Button as={StyledLink} href={urls.companies.match.index(company.id)}>
          Verify business details
        </Button>
      </StatusMessage>
    )}
    <StyledGridColumn>
      <StyledNav aria-label="local navigation" data-test="tabbedLocalNav">
        <StyledUnorderedList data-test="tabbedLocalNavList">
          {transformLocalNavItems(localNavItems(company.id), userPermissions)}
        </StyledUnorderedList>
      </StyledNav>
    </StyledGridColumn>
  </StyledGridRow>
)

export default connect(state2props)(CompanyTabbedLocalNavigation)

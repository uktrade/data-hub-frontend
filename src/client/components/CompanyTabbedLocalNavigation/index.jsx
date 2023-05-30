import React from 'react'
import PropTypes from 'prop-types'

import CompanyLocalTab from './CompanyLocalTab'
import styled from 'styled-components'
import Paragraph from '@govuk-react/paragraph'
import WarningText from '@govuk-react/warning-text'
import Details from '@govuk-react/details'
import Button from '@govuk-react/button'
import urls from '../../../lib/urls'
import StatusMessage from '../../../client/components/StatusMessage'
import { BLACK } from '../../../client/utils/colours'

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

const checkObjectType = (company) =>
  company.duns_number
    ? !company.duns_number && !company.pending_dnb_investigation
    : !company.dunsNumber && !company.pendingDnbInvestigation

const CompanyTabbedLocalNavigation = (props) => {
  const { localNavItems } = props
  const company = props.company
  const showMatchingPrompt = checkObjectType(company)

  return (
    <StyledGridRow>
      {showMatchingPrompt && (
        <StatusMessage colour={BLACK} id="ga-company-details-matching-prompt">
          <WarningText>
            Business details on this company record have not been verified and
            could be wrong.
          </WarningText>
          <Details summary="Why verify?">
            <Paragraph>
              Using verified business details from a trusted third-party
              supplier means we can keep certain information up to date
              automatically. This helps reduce duplicate records, provide a
              shared view of complex companies and make it more likely we can
              link other data sources together.
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

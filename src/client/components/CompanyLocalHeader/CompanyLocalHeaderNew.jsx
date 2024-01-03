import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Main from '@govuk-react/main'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'
import { Link } from 'govuk-react'
import { H4 } from '@govuk-react/heading'

import { GREY_3, TEXT_COLOUR } from '../../utils/colours'
import LocalHeaderCompanyLists from './LocalHeaderCompanyLists'
import LocalHeaderCompanyRefer from './LocalHeaderCompanyRefer'
import Badge from '../Badge'
import StatusMessage from '../StatusMessage'
import { addressToStringResource } from '../../utils/addresses'
import urls from '../../../lib/urls'
import ArchivePanel from '../ArchivePanel'
import { isItaTierDAccount } from '../../modules/Companies/utils'
import { RelatedCompaniesCountResource } from '../Resource'

const LocalHeaderTradingNames = styled(H4)`
  font-weight: normal;
`

const StyledAddress = styled('p')`
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

const BadgeText = styled('span')`
  font-weight: 600;
  font-size: ${FONT_SIZE.SIZE_16};
`

const TypeWrapper = styled('div')`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    display: table-row;
  }
`
const StyledButtonContainer = styled('div')`
  width: 100%;
  display: inline-block;
`

const StyledList = styled('div')`
  padding-bottom: 10px;
  display: inline-flex;
`

const StyledButtonLink = styled.a({
  marginBottom: 10,
  float: 'right',
})

const BadgeWrapper = styled('div')`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    display: table-cell;
  }
`

const StyledDetails = styled(Details)`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    margin: 0 0 0 ${SPACING.SCALE_3};
  }
  span,
  div {
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

const StyledDescription = styled('div')`
  padding: ${SPACING.SCALE_2};
  background-color: ${GREY_3};

  * + & {
    margin-top: ${SPACING.SCALE_3};
  }

  p {
    margin-top: 0;
    margin-bottom: 0;

    &:not(:last-child) {
      margin-bottom: ${SPACING.SCALE_2};
    }
  }

  & + * {
    margin-top: ${SPACING.SCALE_3};
  }
`

const StyledMain = styled(Main)`
  padding-top: ${SPACING.SCALE_1};
  div {
    font-size: ${FONT_SIZE.SIZE_20};
  }
`
const StyledRelatedCompaniesWrapper = styled('div')`
  padding-bottom: 20px;
`

const isUltimate = (company) => !!company.isGlobalUltimate
const isGlobalHQ = (company) =>
  company.headquarterType && company.headquarterType.name === 'ghq'

const hasAllocatedLeadIta = (company) =>
  company.oneListGroupGlobalAccountManager != null

const hasManagedAccountDetails = (company) =>
  company.oneListGroupTier && hasAllocatedLeadIta(company)

const CompanyLocalHeaderNew = ({ company, returnUrl, csrfToken }) =>
  company && (
    <>
      <GridRow>
        <GridCol setWidth="two-thirds">
          {company?.tradingNames?.length > 0 && (
            <LocalHeaderTradingNames data-test="trading-names">
              Trading as: {company.tradingNames.join(', ')}
            </LocalHeaderTradingNames>
          )}

          <StyledAddress data-test="address">
            {addressToStringResource(company.address)}
          </StyledAddress>
          <RelatedCompaniesCountResource id={company.id}>
            {({ relatedCompaniesCount }) =>
              relatedCompaniesCount > 0 && (
                <StyledRelatedCompaniesWrapper>
                  <Link
                    href={urls.companies.dnbHierarchy.tree(company.id)}
                    data-test="company-tree-link"
                  >
                    {`View company tree: ${
                      relatedCompaniesCount + 1
                    } companies`}
                  </Link>
                </StyledRelatedCompaniesWrapper>
              )
            }
          </RelatedCompaniesCountResource>
        </GridCol>
        <GridCol setWith="one-third">
          <StyledButtonContainer>
            <Button
              as={StyledButtonLink}
              data-test="header-add-interaction"
              href={urls.companies.interactions.create(company.id)}
              aria-label={`Add interaction with ${company.name}`}
            >
              Add interaction
            </Button>
            <Button
              as={StyledButtonLink}
              data-test="header-add-export-project"
              href={urls.exportPipeline.create(company.id)}
              aria-label={`Add export project`}
              buttonColour={GREY_3}
              buttonTextColour={TEXT_COLOUR}
            >
              Add export project
            </Button>
          </StyledButtonContainer>
        </GridCol>
      </GridRow>
      <StyledList>
        <LocalHeaderCompanyLists company={company} returnUrl={returnUrl} />
        <LocalHeaderCompanyRefer companyId={company.id} />
      </StyledList>
      {(isUltimate(company) || isGlobalHQ(company)) && (
        <TypeWrapper>
          <BadgeWrapper>
            <Badge>
              <BadgeText data-test="badge">
                {isUltimate(company) ? 'Ultimate HQ' : 'Global HQ'}
              </BadgeText>
            </Badge>
          </BadgeWrapper>
          {isUltimate(company) && (
            <StyledDetails
              summary="What does Ultimate HQ mean?"
              data-test="ultimate-hq-details"
            >
              This HQ is in control of all related company records for{' '}
              {company.name}.
            </StyledDetails>
          )}
        </TypeWrapper>
      )}
      {hasManagedAccountDetails(company) && (
        <StyledDescription data-test="description">
          {hasManagedAccountDetails(company) && (
            <>
              <p>
                This is an account managed company (One List{' '}
                {company.oneListGroupTier.name})
              </p>
              <p>
                {isItaTierDAccount(company.oneListGroupTier)
                  ? 'Lead ITA'
                  : 'Global Account Manager'}
                : {company.oneListGroupGlobalAccountManager.name}{' '}
                <a href={urls.companies.accountManagement.index(company.id)}>
                  {isItaTierDAccount(company.oneListGroupTier)
                    ? 'View Lead adviser'
                    : 'View core team'}
                </a>
              </p>
            </>
          )}
        </StyledDescription>
      )}

      {company.archived && (
        <ArchivePanel
          archivedBy={company.archivedBy}
          archivedOn={company.archivedOn}
          archiveReason={company.archivedReason}
          unarchiveUrl={`${urls.companies.unarchive(
            company.id
          )}?_csrf=${csrfToken}`}
          type="company"
        />
      )}

      {company.pendingDnbInvestigation && (
        <StyledMain data-test="investigation-message">
          <StatusMessage>
            This company record is based on information that has not yet been
            validated. This information is currently being checked by the Data
            Hub support team.
          </StatusMessage>
        </StyledMain>
      )}
    </>
  )

CompanyLocalHeaderNew.propTypes = {
  company: PropTypes.object.isRequired,
  returnUrl: PropTypes.string,
}

CompanyLocalHeaderNew.defaultProps = {
  returnUrl: null,
}

export default CompanyLocalHeaderNew

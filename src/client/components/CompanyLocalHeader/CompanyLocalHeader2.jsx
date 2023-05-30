/**
 * This is a temporary file so that tests for pages using the old CLH component still pass.
 * Once the refactoring process is finalised, the old CLH will be deleted and replaced with this.
 */

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'
import Main from '@govuk-react/main'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'

import { GREY_3, TEXT_COLOUR } from '../../utils/colours'
import LocalHeader from '../LocalHeader/LocalHeader'
import LocalHeaderHeading from '../LocalHeader/LocalHeaderHeading'
import LocalHeaderCompanyLists from './LocalHeaderCompanyLists'
import Badge from '../Badge'
import StatusMessage from '../StatusMessage'
import { addressToStringResource } from '../../utils/addresses'
import urls from '../../../lib/urls'
import ArchivePanel from '../ArchivePanel'

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

const isUltimate = (company) => !!company.isGlobalUltimate
const isGlobalHQ = (company) =>
  company.headquarterType && company.headquarterType.name === 'ghq'

const hasAllocatedLeadIta = (company) =>
  company.oneListGroupGlobalAccountManager != null

const hasManagedAccountDetails = (company) =>
  company.oneListGroupTier && hasAllocatedLeadIta(company)

const isItaTierDAccount = (company) =>
  company.oneListGroupTier &&
  company.oneListGroupTier.id === '1929c808-99b4-4abf-a891-45f2e187b410'

const CompanyLocalHeader2 = ({
  breadcrumbs,
  flashMessages,
  company,
  dnbRelatedCompaniesCount,
  returnUrl,
}) => {
  return (
    company && (
      <>
        <LocalHeader breadcrumbs={breadcrumbs} flashMessages={flashMessages}>
          <GridRow>
            <GridCol setWidth="two-thirds">
              <LocalHeaderHeading data-test="heading">
                {company.name}
              </LocalHeaderHeading>
              <StyledAddress data-test="address">
                {addressToStringResource(company.address)}
              </StyledAddress>
            </GridCol>
            <GridCol setWith="one-third">
              <StyledButtonContainer>
                <Button
                  as={StyledButtonLink}
                  data-test={'header-add-interaction'}
                  href={urls.companies.interactions.create(company.id)}
                  aria-label={`Add interaction with ${name}`}
                >
                  Add interaction
                </Button>
                <Button
                  as={StyledButtonLink}
                  data-test={'header-add-export-project'}
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
                  data-test="metaList"
                >
                  This HQ is in control of all related company records for{' '}
                  {company.name}.
                </StyledDetails>
              )}
            </TypeWrapper>
          )}
          {(dnbRelatedCompaniesCount > 0 ||
            hasManagedAccountDetails(company)) && (
            <StyledDescription data-test="description">
              {dnbRelatedCompaniesCount > 0 && (
                <p>
                  Data Hub contains{' '}
                  <a href={urls.companies.dnbHierarchy.index(company.id)}>
                    {dnbRelatedCompaniesCount} other company{' '}
                    {pluralize('record', dnbRelatedCompaniesCount)}
                  </a>{' '}
                  related to this company
                </p>
              )}
              {hasManagedAccountDetails(company) && (
                <>
                  <p>
                    This is an account managed company (One List{' '}
                    {company.oneListGroupTier.name})
                  </p>
                  <p>
                    {isItaTierDAccount(company)
                      ? 'Lead ITA'
                      : 'Global Account Manager'}
                    : {company.oneListGroupGlobalAccountManager.name}{' '}
                    <a href={urls.companies.advisers.index(company.id)}>
                      {isItaTierDAccount(company)
                        ? 'View Lead adviser'
                        : 'View core team'}
                    </a>
                  </p>
                </>
              )}
            </StyledDescription>
          )}
        </LocalHeader>

        {company.archived && (
          <ArchivePanel
            archivedBy={company.archivedBy}
            archivedOn={company.archivedOn}
            archiveReason={company.archivedReason}
            unarchiveUrl={urls.companies.unarchive(company.id)}
            type="company"
          />
        )}

        {company.pendingDnbInvestigation && (
          <StyledMain data-test="investigationMessage">
            <StatusMessage>
              This company record is based on information that has not yet been
              validated. This information is currently being checked by the Data
              Hub support team.
            </StatusMessage>
          </StyledMain>
        )}
      </>
    )
  )
}

CompanyLocalHeader2.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }),
  company: PropTypes.object.isRequired,
  dnbRelatedCompaniesCount: PropTypes.number,
  returnUrl: PropTypes.string,
}

CompanyLocalHeader2.defaultProps = {
  flashMessages: null,
  dnbRelatedCompaniesCount: null,
  returnUrl: null,
}

export default CompanyLocalHeader2

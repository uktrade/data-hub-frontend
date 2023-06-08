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
import {
  GREY_3,
  PURPLE,
  BLACK,
  TEXT_COLOUR,
} from '../../../client/utils/colours'
import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderHeading from '../../../client/components/LocalHeader/LocalHeaderHeading'
import LocalHeaderCompanyLists from './LocalHeaderCompanyLists'
import LocalHeaderCompanyRefer from './LocalHeaderCompanyRefer'
import Badge from '../../../client/components/Badge'
import StatusMessage from '../../../client/components/StatusMessage'
import { addressToString } from '../../../client/utils/addresses'
import urls from '../../../lib/urls'
import NewWindowLink from '../NewWindowLink'
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

const StyledDetailsMuted = styled(Details)`
  margin: 0;
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

const StyledMainMuted = styled(Main)`
  padding-top: ${SPACING.SCALE_1};
  div {
    font-size: ${FONT_SIZE.SIZE_16};
    font-weight: normal;
    color: ${BLACK};
  }
  div > div {
    border: 3px solid ${PURPLE};
    margin: 0;
    padding: ${SPACING.SCALE_3};
  }
`

const CompanyLocalHeader = ({
  breadcrumbs,
  flashMessages,
  company,
  dnbRelatedCompaniesCount,
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
                {addressToString(company.address)}
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
            <LocalHeaderCompanyLists company={company} />
            <LocalHeaderCompanyRefer company={company} />
          </StyledList>
          {(company.isUltimate || company.isGlobalHQ) && (
            <TypeWrapper>
              <BadgeWrapper>
                <Badge>
                  <BadgeText data-test="badge">
                    {company.isUltimate ? 'Ultimate HQ' : 'Global HQ'}
                  </BadgeText>
                </Badge>
              </BadgeWrapper>
              {company.isUltimate && (
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
            company.hasManagedAccountDetails) && (
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
              {company.hasManagedAccountDetails && (
                <>
                  <p>
                    This is an account managed company (One List{' '}
                    {company.one_list_group_tier.name})
                  </p>
                  <p>
                    {company.isItaTierDAccount
                      ? 'Lead ITA'
                      : 'Global Account Manager'}
                    : {company.one_list_group_global_account_manager.name}{' '}
                    <a href={urls.companies.advisers.index(company.id)}>
                      {company.isItaTierDAccount
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
            archivedBy={company.archived_by}
            archivedOn={company.archived_on}
            archiveReason={company.archived_reason}
            unarchiveUrl={urls.companies.unarchive(company.id)}
            type="company"
          />
        )}

        {company.pending_dnb_investigation && (
          <StyledMain data-test="investigationMessage">
            <StatusMessage>
              This company record is based on information that has not yet been
              validated. This information is currently being checked by the Data
              Hub support team.
            </StatusMessage>
          </StyledMain>
        )}

        {company.account_plan_url && (
          <StyledMainMuted data-test="accountPlanMessage">
            <StatusMessage>
              <a
                href={company.account_plan_url}
                target="_blank"
                aria-label="Opens in a new window or tab"
                rel="noopener noreferrer"
              >
                Go to Sharepoint to view the account plan
              </a>{' '}
              for {company.name} (opens in a new window or tab). You might have
              to request access to this file.
              {company.one_list_group_global_account_manager &&
                company.one_list_group_global_account_manager.contact_email && (
                  <>
                    &nbsp;To do so, contact the Global Account Manager at&nbsp;
                    <a
                      href={
                        'mailto:' +
                        company.one_list_group_global_account_manager
                          .contact_email
                      }
                    >
                      {
                        company.one_list_group_global_account_manager
                          .contact_email
                      }
                    </a>
                    .
                  </>
                )}
              <StyledDetailsMuted
                summary="What is an account plan?"
                data-test="metaList"
              >
                All businesses on the One List are expected to have an account
                plan, to ensure that the wider virtual team understands the
                company and its key priorities. The Global Account Manager is
                responsible for adding and updating the account plan. For
                further information{' '}
                <NewWindowLink
                  href={
                    urls.external.digitalWorkspace.accountManagementStrategyTeam
                  }
                  aria-label="view the Account management Framework"
                >
                  view the Account management Framework
                </NewWindowLink>
              </StyledDetailsMuted>
            </StatusMessage>
          </StyledMainMuted>
        )}
      </>
    )
  )
}

CompanyLocalHeader.propTypes = {
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

CompanyLocalHeader.defaultProps = {
  flashMessages: null,
  dnbRelatedCompaniesCount: null,
  returnUrl: null,
}

export default CompanyLocalHeader

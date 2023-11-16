import React from 'react'
import { H3, H4, Link, GridCol, GridRow } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import styled from 'styled-components'

import { Metadata, NewWindowLink } from '../../../components'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import {
  CompanyObjectivesCountResource,
  CompanyObjectivesResource,
  CompanyResource,
} from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { format } from '../../../../client/utils/date'
import { DARK_GREY, GREY_2, GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import { LeadITA } from './LeadAdvisers'
import { CoreTeamAdvisers } from '../CoreTeam/CoreTeam'
import { isItaTierDAccount } from '../utils'
import { ONE_LIST_EMAIL } from './constants'

const LastUpdatedHeading = styled.div`
  color: ${DARK_GREY};
  font-weight: normal;
  margin-top: -${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
  font-size: ${FONT_SIZE.SIZE_14};
`

const BorderContainer = styled('div')`
  border-top: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_4} 0px;
  ${({ finalItem }) =>
    finalItem &&
    `border-bottom: 1px solid ${GREY_2}; margin-bottom: ${SPACING.SCALE_5};`}
`

const StyledLink = styled(Link)`
  padding-right: ${SPACING.SCALE_5};
`

const SectionGridRow = styled(GridRow)`
  padding-bottom: ${SPACING.SCALE_2};
  padding-top: ${SPACING.SCALE_2};
`

const AddObjectiveButton = styled(GridCol)`
  width: fit-content;
  padding-right: unset;
`

const ArchivedObjectivesLink = styled(GridCol)`
  padding-top: 7px;
`
const oneListEmail = 'one.list@invest-trade.uk'

const canEditOneList = (permissions) =>
  permissions &&
  permissions.includes('company.change_company') &&
  permissions.includes('company.change_one_list_core_team_member') &&
  permissions.includes(
    'company.change_one_list_tier_and_global_account_manager'
  )

const Strategy = ({ company }) => (
  <SectionGridRow data-test="strategy-row">
    <GridCol>
      <GridRow>
        <GridCol>
          <H3>DBT Strategy</H3>
        </GridCol>
        {company.strategy && (
          <StyledLink
            href={urls.companies.accountManagement.strategy.edit(company.id)}
            data-test="edit-strategy-link"
          >
            Edit
          </StyledLink>
        )}
      </GridRow>

      {company.strategy && (
        <>
          <GridRow>
            <GridCol>
              <LastUpdatedHeading data-test="last-updated-strategy-details">
                <span>{`Last updated by ${company?.modifiedBy?.name}: ${format(
                  company.modifiedOn
                )}. `}</span>
                <span>
                  View changes in{' '}
                  <Link
                    href={urls.companies.editHistory.index(company.id)}
                    data-test="edit-history-link"
                  >
                    Edit history page
                  </Link>
                </span>
              </LastUpdatedHeading>
            </GridCol>
          </GridRow>
          <Metadata rows={[{ value: company.strategy }]}></Metadata>
        </>
      )}

      {!company.strategy && (
        <Button
          data-test="add-strategy-button"
          as={Link}
          href={urls.companies.accountManagement.strategy.create(company.id)}
          buttonColour={GREY_3}
          buttonTextColour={TEXT_COLOUR}
        >
          Add strategy
        </Button>
      )}
    </GridCol>
  </SectionGridRow>
)

const Objectives = ({ company }) => (
  <CompanyObjectivesResource id={company.id} payload={{ archived: false }}>
    {({ results }) => (
      <SectionGridRow data-test="objectives-row">
        <GridCol>
          <H3>Current objectives</H3>
          {results.map((objective, index) => (
            <BorderContainer
              key={`objective_${index}`}
              data-test={`objective ${
                objective.hasBlocker ? 'has-blocker' : 'no-blocker'
              }`}
              finalItem={index === results.length - 1}
            >
              <GridRow>
                <GridCol>
                  <H4>{objective.subject}</H4>
                </GridCol>
                <StyledLink
                  href={urls.companies.accountManagement.objectives.edit(
                    company.id,
                    objective.id
                  )}
                  data-test="edit-objective-link"
                >
                  Edit
                </StyledLink>
              </GridRow>

              <GridRow>
                <GridCol>
                  <LastUpdatedHeading data-test="last-updated-details">
                    <span>{`Last updated by ${
                      objective?.modifiedBy?.name
                    }: ${format(objective.modifiedOn)}`}</span>
                  </LastUpdatedHeading>
                </GridCol>
              </GridRow>

              <Metadata rows={objectiveMetadata(objective)}></Metadata>
            </BorderContainer>
          ))}

          <GridRow>
            <AddObjectiveButton setWidth="one-quarter">
              <Button
                data-test="add-objective-button"
                as={Link}
                href={urls.companies.accountManagement.objectives.create(
                  company.id
                )}
                buttonColour={GREY_3}
                buttonTextColour={TEXT_COLOUR}
              >
                Add new objective
              </Button>
            </AddObjectiveButton>
            <ArchivedObjectivesLink setWidth="one-quarter">
              <CompanyObjectivesCountResource id={company.id}>
                {(response) =>
                  response.archivedCount > 0 && (
                    <Link
                      href={urls.companies.accountManagement.objectives.archived(
                        company.id
                      )}
                      data-test="archived-objectives-link"
                    >
                      View archived objectives
                    </Link>
                  )
                }
              </CompanyObjectivesCountResource>
            </ArchivedObjectivesLink>
          </GridRow>
        </GridCol>
      </SectionGridRow>
    )}
  </CompanyObjectivesResource>
)

const objectiveMetadata = (objective) => {
  const rows = [
    {
      value: objective.detail,
    },
    {
      label: 'Due date',
      value: format(objective.targetDate),
    },
    {
      label: 'Progress',
      value: `${objective.progress}%`,
    },
  ]
  if (objective.hasBlocker) {
    rows.splice(1, 0, {
      label: 'Blockers',
      value: objective.blockerDescription,
    })
  }
  return rows
}

const AccountManagement = ({
  localNavItems,
  companyId,
  dnbRelatedCompaniesCount,
  flashMessages,
  csrfToken,
  permissions,
}) => {
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <CompanyLayout
          company={company}
          breadcrumbs={[{ text: 'Account management' }]}
          localNavItems={localNavItems}
          dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
          flashMessages={flashMessages}
          csrfToken={csrfToken}
        >
          <Strategy company={company} />
          <Objectives company={company} />
          {!company.oneListGroupTier ||
          isItaTierDAccount(company.oneListGroupTier) ? (
            <LeadITA company={company} permissions={permissions} />
          ) : (
            <div>
              <CoreTeamAdvisers
                company={company}
                oneListEmail={ONE_LIST_EMAIL}
              />
              {canEditOneList(permissions) && (
                <div>
                  <Button
                    data-test="edit-core-team-button"
                    as={Link}
                    href={urls.companies.editVirtualTeam(companyId)}
                  >
                    Edit core team
                  </Button>
                </div>
              )}
            </div>
          )}
          <Details
            summary="Need to find out more, or edit the One List tier information?"
            data-test="core-team-details"
          >
            For more information, or if you need to change the One List tier or
            account management team for this company, go to the{' '}
            <NewWindowLink
              href={urls.external.digitalWorkspace.accountManagement}
            >
              Digital Workspace
            </NewWindowLink>{' '}
            or email <Link href={`mailto:${oneListEmail}`}>{oneListEmail}</Link>
          </Details>
        </CompanyLayout>
      )}
    </CompanyResource>
  )
}

export default AccountManagement

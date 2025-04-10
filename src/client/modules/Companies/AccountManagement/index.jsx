import React from 'react'
import { H2, H3, GridCol, GridRow } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import Button from '@govuk-react/button'
import Details from '@govuk-react/details'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { typography } from '@govuk-react/lib'

import { Metadata, NewWindowLink } from '../../../components'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import {
  CompanyObjectivesCountResource,
  CompanyObjectivesResource,
  CompanyResource,
} from '../../../components/Resource'
import urls from '../../../../lib/urls'
import {
  formatDate,
  DATE_FORMAT_COMPACT,
} from '../../../../client/utils/date-utils'
import { DARK_GREY, GREY_2, GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import { LeadITA } from './LeadAdvisers'
import { CoreTeamAdvisers } from '../CoreTeam/CoreTeam'
import { isItaTierDAccount } from '../utils'
import { ONE_LIST_EMAIL } from './constants'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'
import { state2propsMainTab } from './state'
import {
  canEditOneList,
  isOneListAccountOwner,
} from '../CompanyBusinessDetails/utils'
import AccessibleLink from '../../../components/Link'

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

const StyledLink = styled(AccessibleLink)`
  padding-right: ${SPACING.SCALE_5};
`

const StyledH2 = styled(H2)`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_2};
`

const StyledH3 = styled(H3)`
  ${typography.font({ size: 19, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_2};
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

const DataWorkspaceAccountPlan = ({ company }) => (
  <SectionGridRow data-test="account-plan-row">
    <GridCol>
      <GridRow>
        <GridCol>
          <StyledH2>Account plan</StyledH2>
        </GridCol>
      </GridRow>
      <GridCol>
        <GridRow>
          An account plan is a forward thinking dashboard of the company,
          summarising the wider company's scale, their investment and export
          ambitions alongside DBT's relationships and progress with them.
        </GridRow>
      </GridCol>
      <br />
      <NewWindowLink
        href={urls.external.dataWorkspace.accountPlans(company.id)}
      >
        View {company.name}'s account plan
      </NewWindowLink>
    </GridCol>
  </SectionGridRow>
)

const Strategy = ({ company }) => (
  <SectionGridRow data-test="strategy-row">
    <GridCol>
      <GridRow>
        <GridCol>
          <StyledH2>DBT Strategy</StyledH2>
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
                <span>{`Last updated by ${company?.modifiedBy?.name}: ${formatDate(
                  company.modifiedOn,
                  DATE_FORMAT_COMPACT
                )}. `}</span>
                <span>
                  View changes in{' '}
                  <AccessibleLink
                    href={urls.companies.editHistory.index(company.id)}
                    data-test="edit-history-link"
                  >
                    Edit history page
                  </AccessibleLink>
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
          as={'a'}
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
          <StyledH2>Current objectives</StyledH2>
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
                  <StyledH3>{objective.subject}</StyledH3>
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
                    }: ${formatDate(objective.modifiedOn, DATE_FORMAT_COMPACT)}`}</span>
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
                as={'a'}
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
                    <AccessibleLink
                      href={urls.companies.accountManagement.objectives.archived(
                        company.id
                      )}
                      data-test="archived-objectives-link"
                    >
                      View archived objectives
                    </AccessibleLink>
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
      value: formatDate(objective.targetDate, DATE_FORMAT_COMPACT),
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

const AccountManagement = ({ permissions, currentAdviserId }) => {
  const { companyId } = useParams()

  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Account management' }]}
            pageTitle="Account management"
          >
            <DataWorkspaceAccountPlan company={company} />
            <Strategy company={company} />
            <Objectives company={company} />
            {!company.oneListGroupTier ||
            isItaTierDAccount(company.oneListGroupTier) ? (
              <LeadITA
                company={company}
                permissions={permissions}
                currentAdviserId={currentAdviserId}
              />
            ) : (
              <div>
                <CoreTeamAdvisers
                  company={company}
                  oneListEmail={ONE_LIST_EMAIL}
                />
                {(isOneListAccountOwner(company, currentAdviserId) ||
                  canEditOneList(permissions)) && (
                  <div>
                    <Button
                      data-test="edit-core-team-button"
                      as={'a'}
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
              For more information, or if you need to change the One List tier
              or account management team for this company, go to the{' '}
              <NewWindowLink href={urls.external.intranet.accountManagement}>
                Intranet
              </NewWindowLink>{' '}
              or email{' '}
              <AccessibleLink href={`mailto:${ONE_LIST_EMAIL}`}>
                {ONE_LIST_EMAIL}
              </AccessibleLink>
            </Details>
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default connect(state2propsMainTab)(AccountManagement)

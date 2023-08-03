import React from 'react'
import {
  CompanyObjectivesResource,
  CompanyResource,
} from '../../../components/Resource'
import { H3, H4, Link } from 'govuk-react'
import Button from '@govuk-react/button'
import urls from '../../../../lib/urls'
import { format } from '../../../../client/utils/date'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'
import { DARK_GREY, GREY_2, GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import { FONT_SIZE } from '@govuk-react/constants'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import { Metadata } from '../../../components'

const LastUpdatedHeading = styled.div`
  color: ${DARK_GREY};
  font-weight: normal;
  margin-top: -20px;
  margin-bottom: -10px;
  font-size: ${FONT_SIZE.SIZE_14};
`

const BorderContainer = styled('div')`
  border-top: 1px solid ${GREY_2};
  padding: 20px 0px;
`

const StyledLink = styled(Link)`
  padding-right: 15px;
`

const SectionGridRow = styled(GridRow)`
  padding-bottom: 10px;
`

const Strategy = ({ company }) => (
  <SectionGridRow data-test="strategy-row">
    <GridCol>
      <GridRow>
        <GridCol>
          <H3>Strategy</H3>
        </GridCol>
        {company.strategy && (
          <div>
            <StyledLink
              href={urls.companies.accountManagement.strategy.create(
                company.id
              )}
              data-test="edit-strategy-link"
            >
              Edit
            </StyledLink>
          </div>
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
          <p>{company.strategy}</p>
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
  <CompanyObjectivesResource id={company.id}>
    {({ results }) => (
      <SectionGridRow data-test="objectives-row">
        <GridCol>
          <H3>Current objectives</H3>
          {results.map((objective, index) => (
            <BorderContainer key={`objective_${index}`}>
              <GridRow>
                <GridCol>
                  <H4>{objective.subject}</H4>
                </GridCol>
                <div>
                  <StyledLink
                    href={urls.companies.accountManagement.objectives.edit(
                      company.id,
                      objective.id
                    )}
                    data-test="edit-objective-link"
                  >
                    Edit
                  </StyledLink>
                </div>
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

              <p>{objective.detail}</p>
              <Metadata rows={objectiveMetadata(objective)}></Metadata>
            </BorderContainer>
          ))}
          <BorderContainer>
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
          </BorderContainer>
        </GridCol>
      </SectionGridRow>
    )}
  </CompanyObjectivesResource>
)

const objectiveMetadata = (objective) => {
  const rows = [
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
    rows.unshift({
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
        </CompanyLayout>
      )}
    </CompanyResource>
  )
}

export default AccountManagement

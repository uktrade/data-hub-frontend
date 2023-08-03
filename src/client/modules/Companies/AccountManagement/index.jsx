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
import { DARK_GREY, GREY_3, TEXT_COLOUR } from '../../../utils/colours'
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

const StyledLink = styled(Link)`
  padding-right: 15px;
`

const Strategy = ({ company }) => (
  <>
    <GridRow>
      <GridCol>
        <H3>Strategy</H3>
      </GridCol>
      {company.strategy && (
        <div>
          <StyledLink
            href={urls.companies.accountManagement.strategy.edit(company.id)}
            data-test="edit-strategy-link"
          >
            Edit
          </StyledLink>
        </div>
      )}
    </GridRow>

    {company.strategy && (
      <>
        <GridCol>
          <GridRow>
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
          </GridRow>
        </GridCol>
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
  </>
)

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
          <CompanyObjectivesResource id={companyId}>
            {({ results }) => (
              <>
                <H3>Current objectives</H3>
                {results.map((objective) => (
                  <>
                    <GridRow>
                      <GridCol>
                        <H4>{objective.subject}</H4>
                      </GridCol>
                      <div>
                        <StyledLink
                          href={urls.companies.accountManagement.objectives.create(
                            company.id
                          )}
                          data-test="edit-objective-link"
                        >
                          Edit
                        </StyledLink>
                      </div>
                    </GridRow>
                    <LastUpdatedHeading data-test="last-updated-details">
                      <span>{`Last updated by ${
                        objective?.modifiedBy?.name
                      }: ${format(objective.modifiedOn)}`}</span>
                    </LastUpdatedHeading>
                    <p>{objective.detail}</p>
                    <Metadata
                      rows={[
                        {
                          label: 'Blockers',
                          value:
                            objective.hasBlocker &&
                            objective.blockerDescription,
                        },
                        { label: 'Due date', value: objective.targetDate },
                        {
                          label: 'Progress',
                          value: `${objective.progress}%`,
                        },
                      ]}
                    ></Metadata>
                  </>
                ))}
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
              </>
            )}
          </CompanyObjectivesResource>
        </CompanyLayout>
      )}
    </CompanyResource>
  )
}

export default AccountManagement

import React from 'react'
import { useParams } from 'react-router-dom'

import { GridCol, GridRow } from 'govuk-react'
import { H3, H4 } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'
import { DefaultLayout } from '../../../components'
import { buildCompanyBreadcrumbs } from '../utils'
import { DARK_GREY, GREY_2 } from '../../../utils/colours'
import urls from '../../../../lib/urls'
import {
  CompanyObjectivesResource,
  CompanyResource,
} from '../../../components/Resource'
import { format } from '../../../utils/date'

const BorderContainer = styled('div')`
  border-top: 1px solid ${GREY_2};
  padding: ${SPACING.SCALE_4} 0px;
  ${({ finalItem }) =>
    finalItem &&
    `border-bottom: 1px solid ${GREY_2}; margin-bottom: ${SPACING.SCALE_5};`}
`

const SectionGridRow = styled(GridRow)`
  padding-bottom: ${SPACING.SCALE_2};
  padding-top: ${SPACING.SCALE_2};
`
const LastUpdatedHeading = styled.div`
  color: ${DARK_GREY};
  font-weight: normal;
  margin-top: -${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
  font-size: ${FONT_SIZE.SIZE_14};
`

const ArchivedObjectives = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => (
        <DefaultLayout
          pageTitle="Archived objectives"
          heading="Archived objectives"
          breadcrumbs={buildCompanyBreadcrumbs(
            [
              {
                link: urls.companies.accountManagement.index(companyId),
                text: 'Account management',
              },
              {
                text: 'Archived objectives',
              },
            ],
            company.id,
            company.name
          )}
        >
          <CompanyObjectivesResource id={company.id}>
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
                    </BorderContainer>
                  ))}
                </GridCol>
              </SectionGridRow>
            )}
          </CompanyObjectivesResource>
        </DefaultLayout>
      )}
    </CompanyResource>
  )
}

export default ArchivedObjectives

import React from 'react'
import { useParams } from 'react-router-dom'
import { GridCol, GridRow, H4 } from 'govuk-react'
import { FONT_SIZE, SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import { DefaultLayout, Metadata } from '../../../components'
import {
  CompanyObjectivesResource,
  CompanyResource,
} from '../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../utils'
import { DARK_GREY, GREY_2 } from '../../../utils/colours'
import { formatDate, DATE_FORMAT_COMPACT } from '../../../utils/date-utils'
import urls from '../../../../lib/urls'

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
const isComplete = (progress) => progress === 100

const objectiveMetadata = (objective) => {
  return [
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
    {
      label: 'Adviser',
      value: objective.modifiedBy?.name,
    },
  ]
}
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
          <CompanyObjectivesResource
            id={company.id}
            payload={{ archived: true }}
          >
            {({ results }) =>
              results.length > 0 ? (
                <SectionGridRow data-test="archived-objectives-row">
                  <GridCol>
                    {results.map((objective, index) => (
                      <BorderContainer
                        key={`objective_${index + 1}`}
                        data-test={`objective-${index + 1}`}
                        finalItem={index === results.length - 1}
                      >
                        <GridRow>
                          <GridCol>
                            <H4>{objective.subject}</H4>
                          </GridCol>
                        </GridRow>

                        <GridRow>
                          <GridCol>
                            {isComplete(objective.progress) ? (
                              <LastUpdatedHeading data-test="last-updated-details">
                                <span>{`Objective complete. Updated by ${
                                  objective?.modifiedBy?.name
                                }: ${formatDate(objective.modifiedOn, DATE_FORMAT_COMPACT)}`}</span>
                              </LastUpdatedHeading>
                            ) : (
                              <LastUpdatedHeading data-test="last-updated-details">
                                <span>{`Objective incomplete. Archived by ${
                                  objective?.modifiedBy?.name
                                }: ${formatDate(objective.modifiedOn, DATE_FORMAT_COMPACT)}`}</span>
                              </LastUpdatedHeading>
                            )}
                          </GridCol>
                        </GridRow>
                        <Metadata rows={objectiveMetadata(objective)} />
                      </BorderContainer>
                    ))}
                  </GridCol>
                </SectionGridRow>
              ) : (
                <SectionGridRow data-test="no-archived-objectives-row">
                  <GridCol style={{ textAlign: 'center' }}>
                    <p>There are no archived objectives for this company.</p>
                  </GridCol>
                </SectionGridRow>
              )
            }
          </CompanyObjectivesResource>
        </DefaultLayout>
      )}
    </CompanyResource>
  )
}

export default ArchivedObjectives

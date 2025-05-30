import React from 'react'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import { Button } from 'govuk-react'
import { H2 } from '@govuk-react/heading'
import { SPACING } from '@govuk-react/constants'
import { typography } from '@govuk-react/lib'
import { useParams } from 'react-router-dom'

import { GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
import ExportWins from './ExportWins'
import GreatProfile from './GreatProfile'
import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import { exportDetailsLabels, exportPotentialLabels } from './labels'
import {
  buildExportPotential,
  buildExportPotentialLastModified,
  transformExportCountries,
} from './transformers'
import DefaultLayoutBase from '../../../components/Layout/DefaultLayoutBase'
import AccessibleLink from '../../../components/Link'

const StyledSummaryTable = styled(SummaryTable)`
  margin-top: 0;
`

const StyledLink = styled(AccessibleLink)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
`

const StyledH2 = styled(H2)`
  ${typography.font({ size: 24, weight: 'bold' })};
  margin-bottom: ${SPACING.SCALE_2};
`

const ExportsIndex = () => {
  const { companyId } = useParams()
  return (
    <DefaultLayoutBase>
      <CompanyResource id={companyId}>
        {(company) => (
          <CompanyLayout
            company={company}
            breadcrumbs={[{ text: 'Exports' }]}
            pageTitle="Export"
          >
            <SummaryTable
              caption="Exports"
              actions={
                !company.archived && (
                  <AccessibleLink href={urls.companies.exports.edit(companyId)}>
                    Edit
                  </AccessibleLink>
                )
              }
            >
              <SummaryTable.Row
                heading={exportDetailsLabels.exportExperienceCategory}
                key={exportDetailsLabels.exportExperienceCategory}
              >
                {company.exportExperienceCategory
                  ? company.exportExperienceCategory.name
                  : 'None'}
              </SummaryTable.Row>
              <SummaryTable.Row
                heading={exportDetailsLabels.greatProfile}
                key={exportDetailsLabels.greatProfile}
              >
                <GreatProfile
                  profileStatus={company.greatProfileStatus}
                  companyNumber={company.companyNumber}
                />
              </SummaryTable.Row>
              <SummaryTable.Row
                heading={exportDetailsLabels.exportPotential}
                key={exportDetailsLabels.exportPotential}
              >
                {buildExportPotential(company)}
              </SummaryTable.Row>
              <SummaryTable.Row
                heading={exportDetailsLabels.lastModifiedPotential}
                key={exportDetailsLabels.lastModifiedPotential}
              >
                {buildExportPotentialLastModified(company)}
              </SummaryTable.Row>
            </SummaryTable>

            <Details summary="What is export potential">
              The export potential score is a prediction of a company's
              likelihood of exporting, and was originally created for the{' '}
              <AccessibleLink
                href={urls.external.dataWorkspace.findExporters}
                target="_blank"
                aria-label="opens in a new tab"
              >
                Find Exporters tool
              </AccessibleLink>
              . DBT's data science team compared all HMRC export information
              with the features of all UK companies to find patterns; they then
              repeatedly tested their model against a subset of known-good data
              to improve it. The scores are as follows:
              <ol>
                {Object.values(exportPotentialLabels).map((category) => (
                  <li key={category.text}>
                    <strong>{category.text}</strong> - {category.description}
                  </li>
                ))}
              </ol>
              <br />
              We are continuing to improve the algorithm so please do share your
              feedback or let us know of any anomalies through the{' '}
              <AccessibleLink href={urls.support()}>
                support channel
              </AccessibleLink>
              .
            </Details>

            <StyledSummaryTable
              caption="Export countries information"
              actions={
                !company.archived && (
                  <AccessibleLink
                    href={urls.companies.exports.editCountries(companyId)}
                    data-test-id="edit-export-countries"
                  >
                    Edit
                  </AccessibleLink>
                )
              }
            >
              {transformExportCountries(company.exportCountries).map(
                ({ name, values }) => (
                  <SummaryTable.Row heading={name} key={name}>
                    <>
                      {values?.length
                        ? values.map(({ id, name }, i) => {
                            const isLastItem = i === values.length - 1
                            return (
                              <React.Fragment key={id}>
                                <AccessibleLink
                                  href={urls.companies.exports.history.country(
                                    companyId,
                                    id
                                  )}
                                >
                                  {name}
                                </AccessibleLink>
                                {isLastItem ? null : ', '}
                              </React.Fragment>
                            )
                          })
                        : 'None'}
                    </>
                  </SummaryTable.Row>
                )
              )}
            </StyledSummaryTable>

            <StyledLink href={urls.companies.exports.history.index(companyId)}>
              View full export countries history
            </StyledLink>
            <StyledH2>Export wins</StyledH2>
            <Button
              as={'a'}
              data-test="add-export-win"
              aria-label="Add export win"
              buttonColour={GREY_3}
              buttonTextColour={TEXT_COLOUR}
              href={urls.companies.exportWins.create(company.id)}
            >
              Add export win
            </Button>
            <Details summary="What is an export win">
              <p>
                Export wins capture the export deals that Department for
                Business and Trade (DBT) support and quantify their expected
                export value. If applicable, they also quantify the non-export
                and outward direct investment (ODI) value, up to a 5-year
                period. They give a picture of DBT support for business.
              </p>
              <p>
                The export win metric is currently the only way the department
                measures export activity.
              </p>
            </Details>
            <ExportWins companyId={companyId} companyName={company.name} />
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default ExportsIndex

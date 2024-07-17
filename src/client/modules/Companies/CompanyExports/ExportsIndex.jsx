import React from 'react'
import styled from 'styled-components'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { Button, WarningText } from 'govuk-react'
import { H3 } from '@govuk-react/heading'
import { SPACING } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import { GREY_3, TEXT_COLOUR } from '../../../utils/colours'
import { SummaryTable } from '../../../components'
import urls from '../../../../lib/urls'
//import ExportWins from './ExportWins'
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

const StyledSummaryTable = styled(SummaryTable)`
  margin-top: 0;
`

const StyledLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${SPACING.SCALE_5};
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
                  <Link href={urls.companies.exports.edit(companyId)}>
                    Edit
                  </Link>
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
              <Link
                href={urls.external.dataWorkspace.findExporters}
                target="_blank"
                aria-label="opens in a new tab"
              >
                Find Exporters tool
              </Link>
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
              <a href={urls.support()}>support channel</a>.
            </Details>

            <StyledSummaryTable
              caption="Export countries information"
              actions={
                !company.archived && (
                  <Link
                    href={urls.companies.exports.editCountries(companyId)}
                    data-test-id="edit-export-countries"
                  >
                    Edit
                  </Link>
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
                                <Link
                                  href={urls.companies.exports.history.country(
                                    companyId,
                                    id
                                  )}
                                >
                                  {name}
                                </Link>
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
            <H3>Export wins</H3>
            <Button
              as={Link}
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
            <WarningText data-test="wins-unavailable">
              This service is currently unavailable due to maintenance. Email{' '}
              <Link href={`mailto:datahubsupport@uktrade.zendesk.com`}>
                datahubsupport@uktrade.zendesk.com
              </Link>{' '}
              if you have any questions
            </WarningText>
            {/*<ExportWins companyId={companyId} companyName={company.name} />*/}
          </CompanyLayout>
        )}
      </CompanyResource>
    </DefaultLayoutBase>
  )
}

export default ExportsIndex

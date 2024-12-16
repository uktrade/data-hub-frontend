import React from 'react'
import { Link } from 'govuk-react'
import { useParams } from 'react-router-dom'

import { SummaryTable } from '../../../components'
import {
  CompanyResource,
  InvestmentResource,
} from '../../../components/Resource'
import { currencyGBP } from '../../../utils/number-utils'
import {
  checkIfItemHasValue,
  transformNewTech,
  transformRAndDBudget,
  transformExportRevenue,
  transformFdiRAndDProject,
  transformFdiType,
} from './transformers'
import urls from '../../../../lib/urls'
import { formatDate, DATE_FORMAT_FULL } from '../../../utils/date-utils'
import ProjectLayoutNew from '../../../components/Layout/ProjectLayoutNew'
import InvestmentName from './InvestmentName'

const NOT_KNOWN = 'Not known'

const checkIfValueExists = (value) => (value ? value : NOT_KNOWN)

const getHQValue = (businessActivities) =>
  businessActivities.find(
    (activity) =>
      activity.name === 'European headquarters' ||
      activity.name === 'Global headquarters'
  )
    ? 'Yes'
    : 'No'

const newJobsRow = (newJobs) => (
  <SummaryTable.TextRow
    heading="Number of new jobs"
    value={checkIfItemHasValue(newJobs) ? newJobs + ' new jobs' : NOT_KNOWN}
  />
)

const landingTable = (ukCompany = null, actualLandDate) => (
  <SummaryTable
    caption="Project Landing (Test C)"
    data-test="project-landing-table"
  >
    <SummaryTable.TextRow
      heading="UK company"
      value={
        ukCompany ? (
          <Link href={urls.companies.overview.index(ukCompany.id)}>
            {ukCompany.name}
          </Link>
        ) : (
          NOT_KNOWN
        )
      }
    />
    <SummaryTable.TextRow
      heading="Companies House number"
      value={
        ukCompany && ukCompany?.companyNumber
          ? ukCompany.companyNumber
          : NOT_KNOWN
      }
    />
    <SummaryTable.TextRow
      heading="Registered address"
      value={
        ukCompany ? (
          <ul>
            {ukCompany.address.line1 && <li>{ukCompany.address.line1}</li>}
            {ukCompany.address.line2 && <li>{ukCompany.address.line2}</li>}
            {ukCompany.address.town && <li>{ukCompany.address.town}</li>}
            {ukCompany.address.county && <li>{ukCompany.address.county}</li>}
            {ukCompany.address.postcode && (
              <li>{ukCompany.address.postcode}</li>
            )}
            {ukCompany.address.country && (
              <li>{ukCompany.address.country.name}</li>
            )}
          </ul>
        ) : (
          NOT_KNOWN
        )
      }
    />

    <SummaryTable.TextRow
      heading="Actual land date"
      value={
        actualLandDate
          ? formatDate(actualLandDate, DATE_FORMAT_FULL)
          : NOT_KNOWN
      }
    />
  </SummaryTable>
)

const ProjectEvaluation = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Evaluation' },
      ]}
      pageTitle="Evaluation"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <CompanyResource id={project.investorCompany.id}>
            {(company) => (
              <>
                <SummaryTable
                  caption="Project value (Test D)"
                  data-test="project-value-table"
                >
                  <SummaryTable.TextRow
                    heading="Primary sector"
                    value={checkIfValueExists(project.sector?.name)}
                  />
                  <SummaryTable.TextRow
                    heading="Total investment"
                    value={checkIfValueExists(
                      currencyGBP(project.totalInvestment)
                    )}
                  />
                  {newJobsRow(project.numberNewJobs)}
                  <SummaryTable.TextRow
                    heading="Average salary"
                    value={checkIfValueExists(project.averageSalary?.name)}
                  />
                  <SummaryTable.TextRow
                    heading="R&D budget"
                    value={
                      project.rAndDBudget == null
                        ? NOT_KNOWN
                        : transformRAndDBudget(project.rAndDBudget)
                    }
                  />
                  <SummaryTable.TextRow
                    heading="Non-FDI R&D project"
                    value={
                      project.nonFdiRAndDBudget
                        ? transformFdiRAndDProject(project)
                        : NOT_KNOWN
                    }
                  />
                  <SummaryTable.TextRow
                    heading="New-to-world tech"
                    value={
                      project.newTechToUk == null
                        ? NOT_KNOWN
                        : transformNewTech(project.newTechToUk)
                    }
                  />
                  <SummaryTable.TextRow
                    heading="Account tier"
                    value={checkIfValueExists(company.oneListGroupTier?.name)}
                  />
                  <SummaryTable.TextRow
                    heading="New GHQ/EHQ"
                    value={
                      project.businessActivities.length > 0
                        ? getHQValue(project.businessActivities)
                        : NOT_KNOWN
                    }
                  />
                  <SummaryTable.TextRow
                    heading="Export revenue"
                    value={
                      project.exportRevenue != null
                        ? transformExportRevenue(project.exportRevenue)
                        : NOT_KNOWN
                    }
                  />
                </SummaryTable>
                <SummaryTable
                  caption="FDI (Test A)"
                  data-test="project-fdi-table"
                >
                  <SummaryTable.TextRow
                    heading="Investment type"
                    value={
                      project.investmentType.name === 'FDI'
                        ? transformFdiType(
                            project.investmentType.name,
                            project.fdiType?.name
                          )
                        : project.investmentType.name
                    }
                  />
                  <SummaryTable.TextRow
                    heading="Foreign investor"
                    value={
                      <Link href={urls.companies.overview.index(company.id)}>
                        {company.name}
                      </Link>
                    }
                  />
                  <SummaryTable.TextRow
                    heading="Foreign country"
                    value={project.investorCompanyCountry.name}
                  />
                  <SummaryTable.TextRow
                    heading="UK company"
                    value={
                      project.ukCompany ? (
                        <Link
                          href={urls.companies.overview.index(
                            project.ukCompany.id
                          )}
                        >
                          {project.ukCompany.name}
                        </Link>
                      ) : (
                        NOT_KNOWN
                      )
                    }
                  />
                  <SummaryTable.TextRow
                    heading="Foreign equity investment"
                    value={checkIfValueExists(
                      currencyGBP(project.foreignEquityInvestment)
                    )}
                  />
                  <SummaryTable.TextRow
                    heading="Investor retains 10% voting power"
                    value={project.ukCompany ? 'Yes' : 'No'}
                  />
                  {newJobsRow(project.numberNewJobs)}
                  <SummaryTable.TextRow
                    heading="Number of safeguarded jobs"
                    value={
                      checkIfItemHasValue(project.numberSafeguardedJobs)
                        ? project.numberSafeguardedJobs + ' safeguarded jobs'
                        : NOT_KNOWN
                    }
                  />
                </SummaryTable>
                {project.ukCompany ? (
                  <CompanyResource id={project.ukCompany?.id}>
                    {(ukCompany) =>
                      landingTable(ukCompany, project.actualLandDate)
                    }
                  </CompanyResource>
                ) : (
                  landingTable(null, project.actualLandDate)
                )}
              </>
            )}
          </CompanyResource>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default ProjectEvaluation

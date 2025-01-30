import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { Button, InsetText, Link } from 'govuk-react'
import { useParams } from 'react-router-dom'

import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import ProjectIncompleteFields from '../ProjectIncompleteFields'
import { SummaryTable } from '../../../../components'
import {
  InvestmentProjectStageResource,
  InvestmentResource,
} from '../../../../components/Resource'
import {
  transformFdiType,
  transformFdiRAndDProject,
  transformRAndDBudget,
  transformNewTech,
  transformExportRevenue,
} from '../transformers'
import { transformBusinessActivity } from './transformers'
import urls from '../../../../../lib/urls'
import { state2props } from './state'
import { transformArray } from '../../../Companies/CompanyInvestments/LargeCapitalProfile/transformers'
import {
  formatDate,
  DATE_FORMAT_FULL,
  DATE_FORMAT_MONTH_YEAR,
} from '../../../../utils/date-utils'
import { GREY_3, BLACK } from '../../../../utils/colours'
import { currencyGBP } from '../../../../utils/number-utils'
import InvestmentName from '../InvestmentName'

const checkIfRequirementsStarted = (project) => {
  const requirementsArrays = [
    project.actualUkRegions,
    project.competitorCountries,
    project.deliveryPartners,
    project.strategicDrivers,
    project.ukRegionLocations,
  ]

  return !requirementsArrays.every(isEmpty) && project.clientRequirements != ''
}

const checkIfValueStarted = (project) => {
  const valueFields = [
    project.clientCannotProvideTotalInvestment,
    project.totalInvestment,
    project.clientCannotProvideForeignInvestment,
    project.foreignEquityInvestment,
    project.grossValueAdded,
    project.numberNewJobs,
    project.numberSafeguardedJobs,
    project.governmentAssistance,
    project.rAndDBudget,
    project.averageSalary,
    project.newTechToUk,
    project.exportRevenue,
    project.nonFdiRAndDBudget,
    project.associatedNonFdiRAndDProject,
  ]

  return !valueFields.every((field) => field == null)
}

const ProjectDetails = ({ currentAdviserId }) => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={{ text: <InvestmentName id={projectId} /> }}
      pageTitle="Project details"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <>
            <InvestmentProjectStageResource>
              {(projectStages) => (
                <ProjectIncompleteFields
                  project={project}
                  currentAdviserId={currentAdviserId}
                  projectStages={projectStages}
                />
              )}
            </InvestmentProjectStageResource>
            <SummaryTable
              data-test="project-details-table"
              caption="Investment project summary"
            >
              <SummaryTable.TextRow
                heading="Client"
                value={
                  <Link
                    href={urls.companies.overview.index(
                      project.investorCompany?.id
                    )}
                    data-test="company-link"
                  >
                    {project.investorCompany?.name}
                  </Link>
                }
              />
              {project.investmentType && (
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
              )}
              {project.sector && (
                <SummaryTable.TextRow
                  heading="Primary sector"
                  value={project.sector?.name}
                />
              )}
              {project.businessActivities &&
                project.businessActivities.length > 0 && (
                  <SummaryTable.TextRow
                    heading="Business activity"
                    value={transformBusinessActivity(
                      project.businessActivities,
                      project.otherBusinessActivity
                    )}
                  />
                )}
              {project.clientContacts && project.clientContacts.length > 0 && (
                <SummaryTable.TextRow
                  heading="Client contacts"
                  value={project.clientContacts.map((contact, i) => (
                    <Link
                      key={`${contact}-${i}`}
                      href={urls.contacts.contact(contact.id)}
                      data-test={`contact-` + i}
                    >
                      {contact.name}
                    </Link>
                  ))}
                />
              )}
              {project.description ? (
                <SummaryTable.TextRow
                  heading="Project description"
                  value={project.description}
                />
              ) : null}
              {project.anonymousDescription ? (
                <SummaryTable.TextRow
                  heading="Anonymised description"
                  value={project.anonymousDescription}
                />
              ) : null}
              {project.estimatedLandDate ? (
                <SummaryTable.TextRow
                  heading="Estimated land date"
                  value={formatDate(
                    project.estimatedLandDate,
                    DATE_FORMAT_MONTH_YEAR
                  )}
                />
              ) : null}
              {project.likelihoodToLand ? (
                <SummaryTable.TextRow
                  heading="Likelihood of landing"
                  value={project.likelihoodToLand?.name}
                />
              ) : null}
              {project.actualLandDate ? (
                <SummaryTable.TextRow
                  heading="Actual land date"
                  value={formatDate(project.actualLandDate, DATE_FORMAT_FULL)}
                />
              ) : null}
              {project.investorType ? (
                <SummaryTable.TextRow
                  heading="New or existing investor"
                  value={project.investorType?.name}
                />
              ) : null}
              {project.levelOfInvolvement ? (
                <SummaryTable.TextRow
                  heading="Level of involvement"
                  value={project.levelOfInvolvement?.name}
                />
              ) : null}
              {project.specificProgrammes.length > 0 ? (
                <SummaryTable.TextRow
                  heading="Specific investment programme"
                  value={project.specificProgrammes
                    ?.map((programme) => programme.name)
                    .join(', ')}
                />
              ) : null}
            </SummaryTable>
            <Button
              as={'a'}
              href={urls.investments.projects.editDetails(project.id)}
              buttonColour={GREY_3}
              buttonTextColour={BLACK}
              data-test="edit-details-button"
            >
              Edit summary
            </Button>

            <SummaryTable
              data-test="project-requirements-table"
              caption="Requirements and location"
            >
              {project.strategicDrivers &&
                project.strategicDrivers.length > 0 && (
                  <SummaryTable.TextRow
                    heading="Strategic drivers"
                    value={transformArray(project.strategicDrivers)}
                  />
                )}
              {project.clientRequirements ? (
                <SummaryTable.TextRow
                  heading="Client requirements"
                  value={project.clientRequirements}
                />
              ) : null}
              {project.competitorCountries &&
                project.competitorCountries.length > 0 && (
                  <SummaryTable.TextRow
                    heading="Competitor countries"
                    value={transformArray(project.competitorCountries)}
                  />
                )}
              {project.ukRegionLocations &&
                project.ukRegionLocations.length > 0 && (
                  <SummaryTable.TextRow
                    heading="Possible UK locations"
                    value={transformArray(project.ukRegionLocations)}
                  />
                )}
              {project.actualUkRegions &&
                project.actualUkRegions.length > 0 && (
                  <SummaryTable.TextRow
                    heading="UK regions landed"
                    value={transformArray(project.actualUkRegions)}
                  />
                )}
              <SummaryTable.TextRow
                heading="UK recipient company"
                value={
                  project.ukCompany ? (
                    <>
                      {project.ukCompany.name}
                      <br />
                      <br />
                      <Link
                        href={
                          urls.investments.projects.recipientCompany(
                            project.id
                          ) +
                          '?name=' +
                          project.ukCompany.name
                        }
                        data-test="edit-company-link"
                      >
                        Edit company
                      </Link>
                      <br />
                      <Link
                        href={urls.investments.projects.removeRecipientCompany(
                          project.id
                        )}
                        data-test="remove-company-link"
                      >
                        Remove company
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={urls.investments.projects.recipientCompany(
                        project.id
                      )}
                      data-test="find-company-link"
                    >
                      Find company
                    </Link>
                  )
                }
              />
              {project.deliveryPartners &&
                project.deliveryPartners.length > 0 && (
                  <SummaryTable.TextRow
                    heading="Delivery partners"
                    value={transformArray(project.deliveryPartners)}
                  />
                )}
            </SummaryTable>
            {checkIfRequirementsStarted(project) ? (
              <Button
                as={'a'}
                href={urls.investments.projects.editRequirements(project.id)}
                buttonColour={GREY_3}
                buttonTextColour={BLACK}
                data-test="edit-requirements-button"
              >
                Edit requirements
              </Button>
            ) : (
              <>
                <InsetText data-test="requirements-inset">
                  Please complete this section to move to Assign PM stage
                </InsetText>
                <Button
                  as={'a'}
                  href={urls.investments.projects.editRequirements(project.id)}
                  data-test="add-requirements-button"
                >
                  Add requirements
                </Button>
              </>
            )}
            <SummaryTable data-test="project-value-table" caption="Value">
              {project.clientCannotProvideTotalInvestment != null && (
                <SummaryTable.TextRow
                  heading="Total investment"
                  value={
                    project.totalInvestment
                      ? currencyGBP(project.totalInvestment)
                      : 'Client cannot provide this information'
                  }
                />
              )}
              {project.clientCannotProvideForeignInvestment != null && (
                <SummaryTable.TextRow
                  heading="Capital expenditure value"
                  value={
                    project.foreignEquityInvestment
                      ? currencyGBP(project.foreignEquityInvestment)
                      : 'Client cannot provide this information'
                  }
                />
              )}
              {project.grossValueAdded && (
                <SummaryTable.CurrencyRow
                  heading="Gross Value Added (GVA)"
                  value={+project.grossValueAdded}
                />
              )}
              {project.governmentAssistance != null && (
                <SummaryTable.TextRow
                  heading="Government assistance"
                  value={
                    project.governmentAssistance
                      ? 'Has government assistance'
                      : 'No government assistance'
                  }
                />
              )}
              {(project.numberNewJobs || project.numberNewJobs === 0) && (
                <SummaryTable.TextRow
                  heading="New jobs"
                  value={project.numberNewJobs + ' new jobs'}
                />
              )}
              {project.averageSalary && (
                <SummaryTable.TextRow
                  heading="Average salary of new jobs"
                  value={project.averageSalary?.name}
                />
              )}
              {(project.numberSafeguardedJobs ||
                project.numberSafeguardedJobs === 0) && (
                <SummaryTable.TextRow
                  heading="Safeguarded jobs"
                  value={project.numberSafeguardedJobs + ' safeguarded jobs'}
                />
              )}
              {project.rAndDBudget != null && (
                <SummaryTable.TextRow
                  heading="R&D budget"
                  value={transformRAndDBudget(project.rAndDBudget)}
                />
              )}
              {checkIfValueStarted(project) && (
                <SummaryTable.TextRow
                  heading="Non-FDI R&D project"
                  value={transformFdiRAndDProject(project)}
                />
              )}
              {project.newTechToUk != null && (
                <SummaryTable.TextRow
                  heading="New-to-world tech"
                  value={transformNewTech(project.newTechToUk)}
                />
              )}
              {project.exportRevenue != null && (
                <SummaryTable.TextRow
                  heading="Export revenue"
                  value={transformExportRevenue(project.exportRevenue)}
                />
              )}
            </SummaryTable>
            {checkIfValueStarted(project) ? (
              <Button
                as={'a'}
                href={urls.investments.projects.editValue(project.id)}
                buttonColour={GREY_3}
                buttonTextColour={BLACK}
                data-test="edit-value-button"
              >
                Edit value
              </Button>
            ) : (
              <>
                <InsetText data-test="value-inset">
                  Please complete ‘Total investment’ and ‘Number of new jobs’ to
                  move to Assign PM stage
                </InsetText>
                <Button
                  as={'a'}
                  href={urls.investments.projects.editValue(project.id)}
                  data-test="add-value-button"
                >
                  Add value
                </Button>
              </>
            )}
          </>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

ProjectDetails.propTypes = {
  currentAdviserId: PropTypes.string.isRequired,
}

export default connect(state2props)(ProjectDetails)

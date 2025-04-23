import React from 'react'
import { useParams } from 'react-router-dom'

import {
  Form,
  FieldAdvisersTypeahead,
  SummaryTable,
  NewWindowLink,
} from '../../../../components'
import urls from '../../../../../lib/urls'
import { TASK_SAVE_INVESTMENT_PROJECT_MANAGERS } from './state'
import { transformObjectForTypeahead } from '../transformers'
import {
  transformAdviserForAPI,
  transformObjectForTable,
  transformLocationsForTable,
} from './transformers'
import {
  CompanyResource,
  InvestmentResource,
} from '../../../../components/Resource'
import ProjectLayout from '../../../../components/Layout/ProjectLayout'
import {
  formatDate,
  DATE_FORMAT_MONTH_YEAR,
} from '../../../../utils/date-utils'
import { currencyGBP } from '../../../../utils/number-utils'
import AccessibleLink from '../../../../components/Link'

const EditProjectManagement = () => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <CompanyResource id={project.investorCompany.id}>
          {(company) => (
            <ProjectLayout
              project={project}
              breadcrumbs={[
                {
                  link: urls.investments.projects.details(project.id),
                  text: project.name,
                },
                {
                  link: urls.investments.projects.team(project.id),
                  text: 'Project team',
                },
                { text: 'Project management' },
              ]}
              pageTitle="Project management"
            >
              <Form
                id="edit-investment-project-management"
                analyticsFormName="editInvestmentProjectManagement"
                initialValues={{
                  project_assurance_adviser: transformObjectForTypeahead(
                    project.projectAssuranceAdviser
                  ),
                  project_manager: transformObjectForTypeahead(
                    project.projectManager
                  ),
                }}
                cancelRedirectTo={() =>
                  urls.investments.projects.team(project.id)
                }
                redirectTo={() => urls.investments.projects.team(project.id)}
                submissionTaskName={TASK_SAVE_INVESTMENT_PROJECT_MANAGERS}
                transformPayload={(values) => ({
                  id: project.id,
                  project_assurance_adviser: transformAdviserForAPI(
                    values.project_assurance_adviser
                  ),
                  project_manager: transformAdviserForAPI(
                    values.project_manager
                  ),
                })}
                flashMessage={() => 'Investment details updated'}
              >
                <SummaryTable
                  caption="Assign project management"
                  data-test="briefProjectSummary"
                >
                  <SummaryTable.Row
                    heading="Primary sector"
                    children={transformObjectForTable(project.sector)}
                  />
                  <SummaryTable.Row
                    heading="Client company"
                    children={
                      <AccessibleLink
                        href={urls.companies.detail(project.investorCompany.id)}
                        aria-label={'client company'}
                      >
                        {project.investorCompany.name}
                      </AccessibleLink>
                    }
                  />
                  <SummaryTable.Row
                    heading="Website"
                    children={
                      company.website ? (
                        <NewWindowLink href={company.website}>
                          {company.website}
                        </NewWindowLink>
                      ) : (
                        ''
                      )
                    }
                  />
                  <SummaryTable.Row
                    heading="Account tier"
                    children={transformObjectForTable(
                      company.oneListGroupTier,
                      'None'
                    )}
                  />
                  <SummaryTable.Row
                    heading="Possible UK locations"
                    children={transformLocationsForTable(
                      project.ukRegionLocations
                    )}
                  />
                  <SummaryTable.Row
                    heading="Competitor countries"
                    children={transformLocationsForTable(
                      project.competitorCountries
                    )}
                  />
                  <SummaryTable.Row
                    heading="Estimated land date"
                    children={formatDate(
                      project.estimatedLandDate,
                      DATE_FORMAT_MONTH_YEAR
                    )}
                  />
                  <SummaryTable.Row
                    heading="Total investment"
                    children={
                      project.totalInvestment
                        ? currencyGBP(project.totalInvestment)
                        : ''
                    }
                  />
                </SummaryTable>
                <FieldAdvisersTypeahead
                  name="project_assurance_adviser"
                  label="Project Assurance Adviser"
                  placeholder="Select an adviser"
                />

                <FieldAdvisersTypeahead
                  name="project_manager"
                  label="Project Manager"
                  placeholder="Select a manager"
                />
              </Form>
            </ProjectLayout>
          )}
        </CompanyResource>
      )}
    </InvestmentResource>
  )
}

export default EditProjectManagement

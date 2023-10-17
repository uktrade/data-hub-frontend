import React from 'react'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import {
  FieldCurrency,
  FieldInput,
  FieldRadios,
  FieldUneditable,
  Form,
} from '../../../../components'
import ResourceOptionsField from '../../../../components/Form/elements/ResourceOptionsField'
import {
  FDIValuesResource,
  InvestmentResource,
  SalaryRangeResource,
} from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import { TASK_EDIT_INVESTMENT_PROJECT_VALUE } from './state'
import {
  setGVAMessage,
  transformBoolToInvertedRadioOptionWithNullCheck,
  transformBoolToRadioOptionWithNullCheck,
  transformProjectValueForApi,
} from './transformers'
import { OPTIONS_YES_NO, OPTION_YES } from '../../../../../common/constants'
import { currencyGBP } from '../../../../utils/number-utils'
import { idNamesToValueLabels } from '../../../../utils'
import ProjectLayout from '../../../../components/Layout/ProjectLayout'

// For projects landing after 01/04/2020, the FDI value field is not needed
const showFDIValueField = (project) =>
  [project.estimatedLandDate, project.actualLandDate].some(
    (date) => date !== null && new Date(date) < new Date('2020-04-01')
  )

const EditProjectValue = () => {
  const { projectId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <ProjectLayout
          project={project}
          breadcrumbs={[
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            { text: 'Edit value' },
          ]}
          pageTitle="Edit value"
        >
          <H2 size={LEVEL_SIZE[3]}>Edit value</H2>
          <Form
            id="edit-project-value"
            analyticsFormName="editInvestmentProjectValue"
            cancelButtonLabel="Back"
            cancelRedirectTo={() =>
              urls.investments.projects.details(project.id)
            }
            flashMessage={() => 'Investment value updated'}
            submitButtonlabel="Save"
            redirectTo={() => urls.investments.projects.details(project.id)}
            submissionTaskName={TASK_EDIT_INVESTMENT_PROJECT_VALUE}
            transformPayload={(values) =>
              transformProjectValueForApi({
                projectId,
                values,
              })
            }
          >
            <FieldRadios
              name="client_cannot_provide_total_investment"
              label="Can client provide total investment value?"
              hint="Includes capital, operational and R&D expenditure"
              initialValue={transformBoolToInvertedRadioOptionWithNullCheck(
                project.clientCannotProvideTotalInvestment
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
                ...(option.value === OPTION_YES && {
                  children: (
                    <FieldCurrency
                      name="total_investment"
                      label="Total investment"
                      hint="Enter the total number of GB pounds"
                      initialValue={project.totalInvestment}
                      type="text"
                      required="Enter the total investment"
                    />
                  ),
                }),
              }))}
            />
            <FieldRadios
              name="client_cannot_provide_foreign_investment"
              label="Can client provide capital expenditure value?"
              hint="Foreign equity only, excluding operational and R&D expenditure"
              initialValue={transformBoolToInvertedRadioOptionWithNullCheck(
                project.clientCannotProvideForeignInvestment
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
                ...(option.value === OPTION_YES && {
                  children: (
                    <>
                      <FieldCurrency
                        name="foreign_equity_investment"
                        label="Capital expenditure value"
                        hint="Enter the total number of GB pounds"
                        initialValue={project.foreignEquityInvestment}
                        type="text"
                        required="Enter the capital expenditure"
                      />
                      {project.investmentType.name === 'FDI' && (
                        <FieldUneditable
                          label="Gross value added (GVA)"
                          name="gross_value_added"
                        >
                          {project.grossValueAdded
                            ? currencyGBP(project.grossValueAdded)
                            : setGVAMessage(project)}
                        </FieldUneditable>
                      )}
                    </>
                  ),
                }),
              }))}
            />
            <FieldInput
              label="Number of new jobs"
              name="number_new_jobs"
              type="number"
              initialValue={project.numberNewJobs?.toString()}
            />
            <ResourceOptionsField
              name="average_salary"
              label="Average salary of new jobs"
              resource={SalaryRangeResource}
              field={FieldRadios}
              initialValue={project.averageSalary?.id}
              resultToOptions={(result) =>
                idNamesToValueLabels(
                  result.filter((option) =>
                    option.disabledOn
                      ? new Date(option.disabledOn) >
                        new Date(project.createdOn)
                      : true
                  )
                )
              }
            />
            <FieldInput
              label="Number of safeguarded jobs"
              name="number_safeguarded_jobs"
              type="number"
              initialValue={project.numberSafeguardedJobs?.toString()}
            />
            {showFDIValueField(project) &&
              project.investmentType.name === 'FDI' && (
                <ResourceOptionsField
                  name="fdi_value"
                  label="Project value"
                  resource={FDIValuesResource}
                  field={FieldRadios}
                  initialValue={project.fdiValue?.id}
                />
              )}
            <FieldRadios
              name="government_assistance"
              label="Is this project receiving government financial assistance?"
              initialValue={transformBoolToRadioOptionWithNullCheck(
                project.governmentAssistance
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
              }))}
            />
            <FieldRadios
              name="r_and_d_budget"
              label="Does this project have budget for research and development?"
              initialValue={transformBoolToRadioOptionWithNullCheck(
                project.rAndDBudget
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
              }))}
            />
            <FieldRadios
              name="non_fdi_r_and_d_budget"
              label="Is this project associated with a non-FDI R&D project?"
              initialValue={transformBoolToRadioOptionWithNullCheck(
                project.nonFdiRAndDBudget
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
              }))}
            />
            <FieldRadios
              name="new_tech_to_uk"
              label="Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?"
              initialValue={transformBoolToRadioOptionWithNullCheck(
                project.newTechToUk
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
              }))}
            />
            <FieldRadios
              name="export_revenue"
              label="Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?"
              initialValue={transformBoolToRadioOptionWithNullCheck(
                project.exportRevenue
              )}
              options={OPTIONS_YES_NO.map((option) => ({
                ...option,
              }))}
            />
          </Form>
        </ProjectLayout>
      )}
    </InvestmentResource>
  )
}

export default EditProjectValue

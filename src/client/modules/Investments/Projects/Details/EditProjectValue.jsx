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
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'
import {
  capitalExpenditureValidator,
  totalInvestmentValidator,
} from './validators'
import {
  isFieldOptionalForStageLabel,
  isFieldRequiredForStage,
  validateFieldForStage,
} from '../validators'
import { FDI_TYPES } from '../constants'

// For projects landing after 01/04/2020, the FDI value field is not needed
const showFDIValueField = (project) =>
  [project.estimatedLandDate, project.actualLandDate].some(
    (date) => date !== null && new Date(date) < new Date('2020-04-01')
  )

const shouldShowJobFields = (project) => {
  // Capital only FDI project will always have 0 jobs so don't show the job-related fields
  return project.fdiType?.name !== FDI_TYPES.capitalOnly.label
}

const NUMBER_NEW_JOBS_REQUIRED_MESSAGE =
  'Value for number of new jobs is required'
const AVERAGE_SALARY_REQUIRED_MESSAGE =
  'Value for average salary of new jobs is required'
const NUMBER_SAFEGUARDED_JOBS_REQUIRED_MESSAGE =
  'Value for number of safeguarded jobs is required'

const isJobFieldRequired = (project, fieldName) => {
  // If it's an FDI project with no involvement, it's not required
  if (
    project.investmentType.name === 'FDI' &&
    project.levelOfInvolvement?.name === 'No Involvement'
  ) {
    return false
  }

  // If it's an expansion FDI project, it's required
  if (
    project.fdiType?.name === FDI_TYPES.expansionOfExistingSiteOrActivity.label
  ) {
    return true
  }

  // For all other cases, check if the field is required for the current stage
  return isFieldRequiredForStage(fieldName, project)
}

const isNumberNewJobsRequired = (project) => {
  return isJobFieldRequired(project, 'number_new_jobs')
}

const isAverageSalaryRequired = (project) => {
  return isJobFieldRequired(project, 'average_salary')
}

const isNumberSafeguardedJobsRequired = (project) => {
  return isJobFieldRequired(project, 'number_safeguarded_jobs')
}

const validateNumberNewJobs = (project, value) => {
  if (!isNumberNewJobsRequired(project)) {
    return
  }
  if (!value) {
    return NUMBER_NEW_JOBS_REQUIRED_MESSAGE
  }

  // For expansion projects, ensure at least 1 new job
  if (
    project.fdiType?.name ==
      FDI_TYPES.expansionOfExistingSiteOrActivity.label &&
    value < 1
  ) {
    return 'Number of new jobs must be greater than 0'
  }

  return
}

const EditProjectValue = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Edit value' },
      ]}
      pageTitle="Edit value"
    >
      <InvestmentResource id={projectId}>
        {(project) => {
          return (
            <>
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
                    fdiTypeId: project.fdiType?.id,
                  })
                }
              >
                <FieldRadios
                  name="client_cannot_provide_total_investment"
                  label={
                    'Can client provide total investment value?' +
                    isFieldOptionalForStageLabel(
                      'client_cannot_provide_total_investment',
                      project
                    )
                  }
                  hint="Includes capital, operational and R&D expenditure"
                  initialValue={transformBoolToInvertedRadioOptionWithNullCheck(
                    project.clientCannotProvideTotalInvestment
                  )}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select whether client can provide total investment value'
                    )
                  }}
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                    ...(option.value === OPTION_YES && {
                      children: (
                        <FieldCurrency
                          name="total_investment"
                          label={
                            'Total investment' +
                            isFieldOptionalForStageLabel(
                              'total_investment',
                              project
                            )
                          }
                          hint="Enter the total number of GB pounds"
                          initialValue={project.totalInvestment}
                          type="text"
                          required="Enter the total investment"
                          validate={(value, field, formFields) => {
                            const result = validateFieldForStage(
                              field,
                              formFields,
                              project,
                              NUMBER_NEW_JOBS_REQUIRED_MESSAGE
                            )
                            return result
                              ? result
                              : totalInvestmentValidator(
                                  value,
                                  formFields.values.foreign_equity_investment
                                )
                          }}
                        />
                      ),
                    }),
                  }))}
                />
                <FieldRadios
                  name="client_cannot_provide_foreign_investment"
                  label={
                    'Can client provide capital expenditure value?' +
                    isFieldOptionalForStageLabel(
                      'client_cannot_provide_foreign_investment',
                      project
                    )
                  }
                  hint="Foreign equity only, excluding operational and R&D expenditure"
                  initialValue={transformBoolToInvertedRadioOptionWithNullCheck(
                    project.clientCannotProvideForeignInvestment
                  )}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select whether client can provide capital expenditure value'
                    )
                  }}
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
                            validate={(value) => {
                              return project.fdiType?.name ===
                                FDI_TYPES.capitalOnly.label
                                ? capitalExpenditureValidator(value)
                                : null
                            }}
                          />
                          {project.investmentType.name === 'FDI' &&
                            project.gvaMultiplier
                              ?.sectorClassificationGvaMultiplier ===
                              'capital' && (
                              <FieldUneditable
                                label="Gross value added (GVA)"
                                name="gross_value_added_capital"
                              >
                                <>
                                  {project.grossValueAdded
                                    ? currencyGBP(project.grossValueAdded)
                                    : setGVAMessage(project)}
                                </>
                              </FieldUneditable>
                            )}
                        </>
                      ),
                    }),
                  }))}
                />
                {!shouldShowJobFields(project) ? null : (
                  <>
                    <FieldInput
                      label={
                        'Number of new jobs' +
                        (isNumberNewJobsRequired(project)
                          ? isFieldOptionalForStageLabel(
                              'number_new_jobs',
                              project
                            )
                          : ' (optional)')
                      }
                      name="number_new_jobs"
                      type="number"
                      {...(isNumberNewJobsRequired(project) && {
                        hint:
                          project.fdiType?.name ===
                          FDI_TYPES.expansionOfExistingSiteOrActivity.label
                            ? 'An expansion project must always have at least 1 new job'
                            : undefined,
                      })}
                      validate={(value) =>
                        validateNumberNewJobs(project, value)
                      }
                      initialValue={project.numberNewJobs}
                    />
                    {project.investmentType.name === 'FDI' &&
                      project.gvaMultiplier
                        ?.sectorClassificationGvaMultiplier === 'labour' && (
                        <FieldUneditable
                          label="Gross value added (GVA)"
                          name="gross_value_added_labour"
                        >
                          <>
                            {project.grossValueAdded
                              ? currencyGBP(project.grossValueAdded)
                              : setGVAMessage(project)}
                          </>
                        </FieldUneditable>
                      )}
                    <FieldCurrency
                      name="actual_average_salary"
                      label={
                        'Average salary of new jobs' +
                        (isAverageSalaryRequired(project)
                          ? isFieldOptionalForStageLabel(
                              'average_salary',
                              project
                            )
                          : ' (optional)')
                      }
                      hint={
                        project.actualAverageSalary === null &&
                        project.averageSalary &&
                        `The current value is "${project.averageSalary?.name}"`
                      }
                      initialValue={project.actualAverageSalary}
                      required={
                        isAverageSalaryRequired(project) &&
                        AVERAGE_SALARY_REQUIRED_MESSAGE
                      }
                    />
                    <FieldInput
                      name="number_safeguarded_jobs"
                      label={
                        'Number of safeguarded jobs' +
                        (isNumberSafeguardedJobsRequired(project)
                          ? isFieldOptionalForStageLabel(
                              'number_safeguarded_jobs',
                              project
                            )
                          : ' (optional)')
                      }
                      type="number"
                      initialValue={project.numberSafeguardedJobs?.toString()}
                      required={
                        isNumberSafeguardedJobsRequired(project) &&
                        NUMBER_SAFEGUARDED_JOBS_REQUIRED_MESSAGE
                      }
                    />
                  </>
                )}
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
                  label={
                    'Is this project receiving government financial assistance?' +
                    isFieldOptionalForStageLabel(
                      'government_assistance',
                      project
                    )
                  }
                  initialValue={transformBoolToRadioOptionWithNullCheck(
                    project.governmentAssistance
                  )}
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                  }))}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select whether project receives government financial assitance'
                    )
                  }}
                />
                <FieldRadios
                  name="r_and_d_budget"
                  label={
                    'Does this project have budget for research and development?' +
                    isFieldOptionalForStageLabel('r_and_d_budget', project)
                  }
                  initialValue={transformBoolToRadioOptionWithNullCheck(
                    project.rAndDBudget
                  )}
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                  }))}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select whether project has budget for research and development'
                    )
                  }}
                />
                <FieldRadios
                  name="non_fdi_r_and_d_budget"
                  label={
                    'Is this project associated with a non-FDI R&D project?' +
                    isFieldOptionalForStageLabel(
                      'non_fdi_r_and_d_budget',
                      project
                    )
                  }
                  initialValue={transformBoolToRadioOptionWithNullCheck(
                    project.nonFdiRAndDBudget
                  )}
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                  }))}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select whether the project is associated with a non-FDI R&D project'
                    )
                  }}
                />
                <FieldRadios
                  name="new_tech_to_uk"
                  label={
                    'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?' +
                    isFieldOptionalForStageLabel('new_tech_to_uk', project)
                  }
                  initialValue={transformBoolToRadioOptionWithNullCheck(
                    project.newTechToUk
                  )}
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                  }))}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select whether project brings new technology to the UK'
                    )
                  }}
                />
                <FieldRadios
                  name="export_revenue"
                  label={
                    'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?' +
                    isFieldOptionalForStageLabel('export_revenue', project)
                  }
                  initialValue={transformBoolToRadioOptionWithNullCheck(
                    project.exportRevenue
                  )}
                  options={OPTIONS_YES_NO.map((option) => ({
                    ...option,
                  }))}
                  validate={(values, field, formFields) => {
                    return validateFieldForStage(
                      field,
                      formFields,
                      project,
                      'Select export revenue as a result of the FDI project'
                    )
                  }}
                />
              </Form>
            </>
          )
        }}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default EditProjectValue

import React from 'react'
import { Link } from 'govuk-react'

import { OPTION_NO, OPTION_YES } from '../../../../common/constants'

import urls from '../../../../lib/urls'

import {
  EXPORT_REVENUE_FALSE,
  EXPORT_REVENUE_TRUE,
  NEW_TECH_FALSE,
  NEW_TECH_TRUE,
  R_AND_D_TRUE,
  R_AND_D_FALSE,
  NOT_LINKED_TO_R_AND_D,
  INVESTMENT_PROJECT_STAGES,
  PROPOSITION_STATUSES,
  STAGE_VERIFY_WIN,
  STAGE_WON,
} from './constants'
import { format } from '../../../utils/date'

import { NOT_SET_TEXT } from '../../../../apps/companies/constants'
import { idNamesToValueLabels } from '../../../utils'
import Tag from '../../../components/Tag'

export const checkIfItemHasValue = (item) => (item ? item : null)

export const transformArrayForTypeahead = (array) =>
  array && array.length
    ? array.map((value) => ({
        label: value.name,
        value: value.id,
      }))
    : null

export const transformAndFilterArrayForTypeahead = (array) => {
  const filteredArray = idNamesToValueLabels(
    array.filter((option) => !option.disabledOn)
  )
  return filteredArray.map((element) => ({
    label: element.label,
    value: element.value,
  }))
}

export const transformObjectForTypeahead = (object) =>
  object
    ? {
        label: object.name,
        value: object.id,
      }
    : {
        label: '',
        value: '',
      }

export const transformObjectForTypeaheadInitialValue = (object) =>
  object
    ? {
        label: object.name,
        value: object.id,
      }
    : null

export const transformBoolToRadioOption = (boolean) =>
  boolean ? OPTION_YES : OPTION_NO

export const transformRadioOptionToBool = (radioOption) =>
  radioOption === OPTION_YES

export const transformRadioOptionToBoolWithNullCheck = (boolean) =>
  boolean === null ? null : transformRadioOptionToBool(boolean)

export const transformProjectStatusForApi = ({ project, values }) => ({
  id: project.id,
  status: values.status,
})

export const mapFieldToUrl = (field, projectId) => {
  const detailsFields = [
    'Actual land date',
    'FDI type',
    'Specific investment programme',
    'Investor type',
    'Level of investor involvement',
    'Likelihood of landing',
  ]
  const valueFields = [
    'Can client provide total investment value?',
    'Will the UK company export a significant proportion of their products and services produced in the UK as a result of the FDI project?',
    'Is this project receiving government financial assistance?',
    'Does the project bring ‘New To World’ Technology, IP or Business Model to the UK site?',
    'Number of new jobs',
    'Number of safeguarded jobs',
    'Does this project have budget for a research and development?',
    'Total investment',
    'Is this project associated with a non-FDI R&D project?',
    'Average salary of new jobs',
    'Can client provide capital expenditure value?',
    'Foreign equity investment',
  ]
  const requirementsFields = [
    'UK regions landed',
    'Is the client considering other countries?',
    'Client requirements',
    'Delivery partners',
    'Strategic drivers behind this investment',
    'Possible UK locations for this investment',
    'Street',
    'Town',
    'Postcode',
    'Competitor countries',
  ]
  const projectManagementFields = [
    'Project Assurance Adviser',
    'Project Manager',
  ]
  const recipientCompanyFields = ['UK recipient company']

  if (detailsFields.includes(field)) {
    return urls.investments.projects.editDetails(projectId)
  }

  if (valueFields.includes(field)) {
    return urls.investments.projects.editValue(projectId)
  }

  if (requirementsFields.includes(field)) {
    return urls.investments.projects.editRequirements(projectId)
  }

  if (projectManagementFields.includes(field)) {
    return urls.investments.projects.editProjectManagement(projectId)
  }

  if (recipientCompanyFields.includes(field)) {
    return urls.investments.projects.recipientCompany(projectId)
  }

  return urls.investments.projects.findAssociatedProject(projectId)
}

export const getNextStage = (currentStage) =>
  INVESTMENT_PROJECT_STAGES[INVESTMENT_PROJECT_STAGES.indexOf(currentStage) + 1]

const getNextStageID = (currentStage, projectStages) => {
  const nextStageName = getNextStage(currentStage)
  const nextStage = projectStages.find((stage) => stage.name === nextStageName)

  return nextStage.id
}

export const transformProjectStageForApi = (values) => {
  const { project, projectStages } = values

  return {
    id: project.id,
    stage: getNextStageID(project.stage.name, projectStages),
  }
}

export const transformFdiType = (FDI, FDIType) =>
  FDIType ? FDI + ', ' + FDIType : FDI + ', None'

export const transformFdiRAndDProject = (project) => {
  if (project.associatedNonFdiRAndDProject) {
    return (
      <>
        {project.associatedNonFdiRAndDProject.name}
        <br />
        <br />
        <Link
          href={
            urls.investments.projects.findAssociatedProject(project.id) +
            '?project_code=' +
            project.associatedNonFdiRAndDProject.projectCode
          }
          data-test="edit-project-link"
        >
          Edit project
        </Link>
        <br />
        {project.stage.name != STAGE_VERIFY_WIN &&
          project.stage.name != STAGE_WON && (
            <Link
              href={urls.investments.projects.removeAssociatedProject(
                project.id
              )}
              data-test="remove-project-link"
            >
              Remove association
            </Link>
          )}
      </>
    )
  }

  if (project.investmentType?.name === 'FDI' && project.nonFdiRAndDBudget) {
    return (
      <Link
        href={urls.investments.projects.findAssociatedProject(project.id)}
        data-test="find-project-link"
      >
        Find project
      </Link>
    )
  }

  return NOT_LINKED_TO_R_AND_D
}

export const transformRAndDBudget = (rAndDBudget) =>
  rAndDBudget ? R_AND_D_TRUE : R_AND_D_FALSE

export const transformNewTech = (newTechToUk) =>
  newTechToUk ? NEW_TECH_TRUE : NEW_TECH_FALSE

export const transformExportRevenue = (exportRevenue) =>
  exportRevenue ? EXPORT_REVENUE_TRUE : EXPORT_REVENUE_FALSE

export const transformPropositionToListItem = ({
  id,
  name,
  investment_project,
  created_on,
  deadline,
  adviser,
  status,
}) => ({
  id,
  metadata: [
    { label: 'Deadline', value: format(deadline, 'dd MMMM yyyy') },
    { label: 'Created on', value: format(created_on, 'dd MMMM yyyy') },
    {
      label: 'Adviser',
      value: adviser.name,
    },
  ].filter(({ value }) => Boolean(value)),
  headingUrl: urls.investments.projects.proposition.details(
    investment_project.id,
    id
  ),
  badges: [
    {
      text: PROPOSITION_STATUSES[status],
    },
  ],
  headingText: name,
  footerdata: {
    investment_project_id: investment_project.id,
    status: status,
    id,
  },
})

export const transformInvestmentProjectToListItem = ({
  id,
  name,
  project_code,
  stage,
  investment_type,
  status,
  investor_company,
  estimated_land_date,
  sector,
}) => {
  const badges = [
    { text: stage.name },
    { text: investment_type.name },
    { text: status },
  ]

  const metadata = [
    { label: 'Investor', value: investor_company.name },
    { label: 'Sector', value: sector ? sector.name : '' },
    {
      label: 'Estimated land date',
      value: estimated_land_date && format(estimated_land_date, 'MMMM yyyy'),
    },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.projects.details(id),
    headingText: name,
    subheading: `Project code ${project_code}`,
    badges,
    metadata,
  }
}

const getTaskSubheading = (archived) =>
  archived ? (
    <Tag colour="green" data-test="activity-kind-label">
      COMPLETED
    </Tag>
  ) : (
    ''
  )

export const transformTaskToListItem = ({
  createdOn,
  id,
  title,
  dueDate,
  advisers,
  archived,
  returnUrl,
} = {}) => ({
  id,
  headingUrl: `${urls.tasks.details(id)}?returnUrl=${returnUrl}`,
  headingText: title,
  subheading: getTaskSubheading(archived),
  metadata: [
    { label: 'Date created', value: format(createdOn, 'dd MMMM yyyy') },
    {
      label: 'Due date',
      value: dueDate ? format(dueDate, 'dd MMMM yyyy') : NOT_SET_TEXT,
    },
    { label: 'Assigned to', value: advisers.map((a) => a.name).join(', ') },
  ],
})

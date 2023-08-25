import React from 'react'
import { Button, Link } from 'govuk-react'

import { transformDateObjectToDateString } from '../../../transformers'
import { OPTION_NO, OPTION_YES } from '../../../../apps/constants'
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
} from './constants'
import { transformArray } from '../../Companies/CompanyInvestments/LargeCapitalProfile/transformers'
import { format } from '../../../utils/date'
import { BLACK, GREY_3 } from '../../../utils/colours'

export const checkIfItemHasValue = (item) => (item ? item : null)

export const transformArrayForTypeahead = (advisers) =>
  advisers.map((value) => ({
    label: value.name,
    value: value.id,
  }))

export const transformBoolToRadioOption = (boolean) =>
  boolean ? OPTION_YES : OPTION_NO

export const transformBoolToRadioOptionWithNullCheck = (boolean) =>
  boolean === null ? null : transformBoolToRadioOption(boolean)

export const transformRadioOptionToBool = (radioOption) =>
  radioOption === OPTION_YES

const transformRadioOptionToInvertedBool = (radioOption) =>
  radioOption === null ? null : radioOption === OPTION_NO

export const transformBoolToInvertedRadioOption = (boolean) =>
  boolean ? OPTION_NO : OPTION_YES

export const transformBoolToInvertedRadioOptionWithNullCheck = (boolean) =>
  boolean === null ? null : transformBoolToInvertedRadioOption(boolean)

export const transformRadioOptionToBoolWithNullCheck = (boolean) =>
  boolean === null ? null : transformRadioOptionToBool(boolean)

const setReferralSourceEvent = (values) => {
  const {
    referral_source_activity,
    referral_source_activity_marketing,
    referral_source_activity_website,
    referral_source_activity_event,
  } = values
  return checkIfItemHasValue(referral_source_activity_marketing) ||
    checkIfItemHasValue(referral_source_activity_website) ||
    checkIfItemHasValue(referral_source_activity)
    ? referral_source_activity_event
    : ''
}

const setReferralSourceAdviser = (currentAdviser, values) => {
  const { is_referral_source, referral_source_adviser } = values
  return is_referral_source === 'yes'
    ? currentAdviser
    : checkIfItemHasValue(referral_source_adviser?.value)
}

const setConditionalArrayValue = (radioValue, array) =>
  transformRadioOptionToBool(radioValue) ? array.map((x) => x.value) : []

const setConditionalStringValue = (inputValue, investmentValue) =>
  transformRadioOptionToBool(inputValue) ? investmentValue : null

const setSiteDecidedSubValues = (
  site_decided,
  address1,
  address2,
  city,
  postcode
) => {
  return transformRadioOptionToBool(site_decided)
    ? {
        address_1: address1,
        address_2: address2,
        address_town: city,
        address_postcode: postcode,
      }
    : {
        address_1: '',
        address_2: '',
        address_town: '',
        address_postcode: '',
      }
}

export const checkLandDate = (estimatedLandDate) => {
  if (estimatedLandDate.day === '') {
    estimatedLandDate.day = '01'
  }
  return transformDateObjectToDateString(estimatedLandDate)
}

export const setGVAMessage = (project) => {
  const { foreignEquityInvestment, sector } = project
  if (!foreignEquityInvestment && !sector) {
    return 'Add capital expenditure value and primary sector (investment project summary) to calculate GVA'
  }

  if (!foreignEquityInvestment) {
    return 'Add capital expenditure value and click "Save" to calculate GVA'
  }

  if (!sector) {
    return 'Add primary sector (investment project summary) to calculate GVA'
  }
}

export const transformProjectSummaryForApi = ({
  projectId,
  currentAdviser,
  values,
}) => {
  const {
    name,
    description,
    anonymous_description,
    estimated_land_date,
    investment_type,
    fdi_type,
    actual_land_date,
    sector,
    likelihood_to_land,
    investor_type,
    level_of_involvement,
    specific_programme,
    business_activities,
    other_business_activity,
    client_contacts,
    referral_source_activity,
    referral_source_activity_marketing,
    referral_source_activity_website,
  } = values

  return {
    id: projectId,
    name,
    description,
    anonymous_description,
    estimated_land_date: checkLandDate(estimated_land_date),
    investment_type: checkIfItemHasValue(investment_type),
    fdi_type: checkIfItemHasValue(fdi_type?.value),
    actual_land_date: transformDateObjectToDateString(actual_land_date),
    sector: checkIfItemHasValue(sector?.value),
    likelihood_to_land: checkIfItemHasValue(likelihood_to_land?.value),
    investor_type: checkIfItemHasValue(investor_type),
    level_of_involvement: checkIfItemHasValue(level_of_involvement?.value),
    specific_programme: checkIfItemHasValue(specific_programme?.value),
    other_business_activity,
    business_activities: business_activities.map((x) => x.value),
    client_contacts: client_contacts.map((x) => x.value),
    referral_source_activity: checkIfItemHasValue(referral_source_activity),
    referral_source_activity_marketing: checkIfItemHasValue(
      referral_source_activity_marketing
    ),
    referral_source_activity_website: checkIfItemHasValue(
      referral_source_activity_website
    ),
    referral_source_activity_event: setReferralSourceEvent(values),
    referral_source_adviser: setReferralSourceAdviser(currentAdviser, values),
  }
}

export const transformProjectRequirementsForApi = ({ projectId, values }) => {
  const {
    actual_uk_regions,
    address1,
    address2,
    city,
    client_considering_other_countries,
    client_requirements,
    competitor_countries,
    delivery_partners,
    postcode,
    site_decided,
    strategic_drivers,
    uk_region_locations,
  } = values

  const siteDecidedObject = setSiteDecidedSubValues(
    site_decided,
    address1,
    address2,
    city,
    postcode
  )

  const requirementsValues = {
    id: projectId,
    actual_uk_regions: setConditionalArrayValue(
      site_decided,
      actual_uk_regions
    ),
    client_considering_other_countries: transformRadioOptionToBoolWithNullCheck(
      client_considering_other_countries
    ),
    client_requirements,
    competitor_countries: setConditionalArrayValue(
      client_considering_other_countries,
      competitor_countries
    ),
    delivery_partners: delivery_partners.map((x) => x.value),
    site_decided: transformRadioOptionToBoolWithNullCheck(site_decided),
    strategic_drivers: strategic_drivers.map((x) => x.value),
    uk_region_locations: uk_region_locations.map((x) => x.value),
  }

  return { ...siteDecidedObject, ...requirementsValues }
}

export const transformProjectValueForApi = ({ projectId, values }) => {
  const {
    average_salary,
    client_cannot_provide_foreign_investment,
    client_cannot_provide_total_investment,
    export_revenue,
    fdi_value,
    foreign_equity_investment,
    government_assistance,
    gross_value_added,
    new_tech_to_uk,
    non_fdi_r_and_d_budget,
    number_new_jobs,
    number_safeguarded_jobs,
    r_and_d_budget,
    total_investment,
  } = values

  return {
    id: projectId,
    average_salary: checkIfItemHasValue(average_salary),
    client_cannot_provide_foreign_investment:
      transformRadioOptionToInvertedBool(
        client_cannot_provide_foreign_investment
      ),
    client_cannot_provide_total_investment: transformRadioOptionToInvertedBool(
      client_cannot_provide_total_investment
    ),
    export_revenue: transformRadioOptionToBoolWithNullCheck(export_revenue),
    fdi_value: checkIfItemHasValue(fdi_value),
    foreign_equity_investment: setConditionalStringValue(
      client_cannot_provide_foreign_investment,
      foreign_equity_investment
    ),
    government_assistance: transformRadioOptionToBoolWithNullCheck(
      government_assistance
    ),
    gross_value_added: setConditionalStringValue(
      client_cannot_provide_foreign_investment,
      gross_value_added
    ),
    new_tech_to_uk: transformRadioOptionToBoolWithNullCheck(new_tech_to_uk),
    non_fdi_r_and_d_budget: transformRadioOptionToBoolWithNullCheck(
      non_fdi_r_and_d_budget
    ),
    number_new_jobs: checkIfItemHasValue(number_new_jobs),
    number_safeguarded_jobs: checkIfItemHasValue(number_safeguarded_jobs),
    r_and_d_budget: transformRadioOptionToBoolWithNullCheck(r_and_d_budget),
    total_investment: setConditionalStringValue(
      client_cannot_provide_total_investment,
      total_investment
    ),
  }
}

export const transformProjectStatusForApi = ({ project, values }) => ({
  id: project.id,
  status: values.status,
})

export const mapFieldToUrl = (field, projectId) => {
  const detailsFields = ['Actual land date', 'FDI type']
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

  return urls.investments.projects.editAssociatedProject(projectId)
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

export const transformBusinessActivity = (
  businessActivity,
  otherBusinessActivity
) =>
  otherBusinessActivity
    ? transformArray(businessActivity) + ', ' + otherBusinessActivity
    : transformArray(businessActivity)

export const transformFdiRAndDProject = (project) => {
  if (project.associatedNonFdiRAndDProject) {
    return (
      <>
        {project.associatedNonFdiRAndDProject.name}
        <br />
        <br />
        <Link
          href={
            urls.investments.projects.editAssociatedProject(project.id) +
            '?term=' +
            project.associatedNonFdiRAndDProject.projectCode
          }
          data-test="edit-project-link"
        >
          Edit project
        </Link>
        <br />
        <Link
          href={urls.investments.projects.removeAssociatedProject(project.id)}
          data-test="remove-project-link"
        >
          Remove association
        </Link>
      </>
    )
  }

  if (project.investmentType?.name === 'FDI' && project.nonFdiRAndDBudget) {
    return (
      <Link
        href={urls.investments.projects.editAssociatedProject(project.id)}
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
} = {}) => ({
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
  buttons:
    status === 'abandoned' || status === 'completed' ? null : (
      <>
        <Button
          as={Link}
          href={urls.investments.projects.proposition.abandon(
            investment_project.id,
            id
          )}
          data-test="abandon-button"
          buttonColour={GREY_3}
          buttonTextColour={BLACK}
        >
          Abandon
        </Button>{' '}
        <Button
          as={Link}
          href={urls.investments.projects.proposition.complete(
            investment_project.id,
            id
          )}
          data-test="complete-button"
        >
          Complete
        </Button>
      </>
    ),
})

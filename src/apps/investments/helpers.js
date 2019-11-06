const { assign, map, sortBy, compact, get } = require('lodash')

const labels = require('./labels')
const logger = require('../../config/logger')

const allLabels = assign(
  {},
  labels.detailsLabels.view,
  labels.valueLabels.view,
  labels.valueLabels.edit,
  labels.requirementsLabels.view,
  labels.requirementsLabels.edit,
  labels.projectManagementLabels.edit,
  labels.projectManagementLabels.edit,
)

const formLinks = {
  projectSummary: 'edit-details',
  requirements: 'edit-requirements',
  value: 'edit-value',
  projectManagement: 'edit-project-management',
  associatedNonFdiRandDProject: 'edit-associated',
}

const formFieldLinks = {
  actual_land_date: formLinks.projectSummary,
  total_investment: formLinks.value,
  government_assistance: formLinks.value,
  number_new_jobs: formLinks.value,
  number_safeguarded_jobs: formLinks.value,
  r_and_d_budget: formLinks.value,
  non_fdi_r_and_d_budget: formLinks.value,
  new_tech_to_uk: formLinks.value,
  export_revenue: formLinks.value,
  client_cannot_provide_total_investment: formLinks.value,
  client_cannot_provide_foreign_investment: formLinks.value,
  actual_uk_regions: formLinks.requirements,
  delivery_partners: formLinks.requirements,
  strategic_drivers: formLinks.requirements,
  client_considering_other_countries: formLinks.requirements,
  uk_region_locations: formLinks.requirements,
  site_decided: formLinks.requirements,
  client_requirements: formLinks.requirements,
  address_1: formLinks.requirements,
  address_town: formLinks.requirements,
  address_postcode: formLinks.requirements,
  project_manager: formLinks.projectManagement,
  project_assurance_adviser: formLinks.projectManagement,
  associated_non_fdi_r_and_d_project: formLinks.associatedNonFdiRandDProject,
}

const toCompleteStageMessages = {
  active: [
    {
      html: `Upload any evidence documents in the 'Evidence' section of the project`,
    },
  ],
  verifyWin: [
    {
      html: `Review the evidence for this investment project using the 'Evidence' section of the project`,
    },
  ],
}

function buildIncompleteFormList (incompleteFields = []) {
  const formList = map(incompleteFields, (incompleteField) => {
    const incompleteFieldLabel = get(allLabels, incompleteField)
    const incompleteFieldFormLink = get(formFieldLinks, incompleteField)

    if (!incompleteFieldLabel) {
      logger.error(`Could not find label for incomplete field ${incompleteField}`)
      return
    }

    if (!incompleteFieldFormLink) {
      logger.error(`Could not find form link for incomplete field ${incompleteField}`)
      return
    }

    return assign({}, { url: incompleteFieldFormLink }, { text: incompleteFieldLabel })
  })

  return sortBy(compact(formList), 'url')
}

module.exports = {
  buildIncompleteFormList,
  toCompleteStageMessages,
}

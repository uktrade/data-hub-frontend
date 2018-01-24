const { assign, map, sortBy, compact, get } = require('lodash')

const config = require('../../../config')
const labels = require('./labels')
const logger = require('../../../config/logger')

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

const linkDetails = {
  projectSummary: {
    url: 'edit-details',
    text: 'Investment project summary form',
  },
  requirements: {
    url: 'edit-requirements',
    text: 'Requirements and location form',
  },
  value: {
    url: 'edit-value',
    text: 'Value form',
  },
  projectManagement: {
    url: 'edit-project-management',
    text: 'Assign project management form',
  },
  associatedNonFdiRandDProject: {
    url: 'edit-associated',
    text: 'Associated project Non-FDI R&D project form',
  },
}

const formFieldLinks = {
  actual_land_date: linkDetails.projectSummary,
  total_investment: linkDetails.value,
  government_assistance: linkDetails.value,
  number_new_jobs: linkDetails.value,
  number_safeguarded_jobs: linkDetails.value,
  r_and_d_budget: linkDetails.value,
  non_fdi_r_and_d_budget: linkDetails.value,
  new_tech_to_uk: linkDetails.value,
  export_revenue: linkDetails.value,
  client_cannot_provide_total_investment: linkDetails.value,
  client_cannot_provide_foreign_investment: linkDetails.value,
  actual_uk_regions: linkDetails.requirements,
  strategic_drivers: linkDetails.requirements,
  client_considering_other_countries: linkDetails.requirements,
  uk_region_locations: linkDetails.requirements,
  site_decided: linkDetails.requirements,
  client_requirements: linkDetails.requirements,
  address_1: linkDetails.requirements,
  address_town: linkDetails.requirements,
  address_postcode: linkDetails.requirements,
  project_manager: linkDetails.projectManagement,
  project_assurance_adviser: linkDetails.projectManagement,
  associated_non_fdi_r_and_d_project: linkDetails.associatedNonFdiRandDProject,
}

const toCompleteStageMessages = {
  active: [
    {
      html: `Upload evidence documents on the <a href="${config.teamSiteSharePointUrl}" aria-labelledby="external-link-label">Evidence teamsite</a> <span id="external-link-label">(will open another website)</span>`,
    },
  ],
  verifyWin: [
    {
      html: `Review the evidence for this investment project on the <a href="${config.teamSiteSharePointUrl}" aria-labelledby="external-link-label">Evidence teamsite</a> <span id="external-link-label">(will open another website)</span>`,
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

    return assign({}, incompleteFieldFormLink, {
      text: `${incompleteFieldLabel} in ${incompleteFieldFormLink.text}`,
    })
  })

  return sortBy(compact(formList), 'url')
}

module.exports = {
  buildIncompleteFormList,
  toCompleteStageMessages,
}

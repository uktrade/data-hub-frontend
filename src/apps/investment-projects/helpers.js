const { get, indexOf, forEach, uniq } = require('lodash')

const formFields = {
  value: [
    'total_investment',
    'government_assistance',
    'number_new_jobs',
    'number_safeguarded_jobs',
    'r_and_d_budget',
    'non_fdi_r_and_d_budget',
    'new_tech_to_uk',
    'export_revenue',
    'client_cannot_provide_total_investment',
    'client_cannot_provide_foreign_investment',
    'fdi_value',
  ],
  requirements: [
    'strategic_drivers',
    'client_considering_other_countries',
    'uk_region_locations',
    'site_decided',
    'client_requirements',
    'address_1',
    'address_town',
    'address_postcode',
  ],
  projectManagement: [
    'project_manager',
    'project_assurance_adviser',
  ],
  associatedNonFdiRandDProject: [
    'associated_non_fdi_r_and_d_project',
  ],
}

const linkDetails = {
  requirements: {
    url: 'edit-requirements',
    text: 'Requirements and location form',
  },
  value: {
    url: 'edit-value',
    text: 'Value',
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

const toCompleteStageMessages = {
  prospect: [
    {
      text: 'Contact the "Trade and Investment Analysis and Performance team"',
    },
  ],
  active: [
    {
      html: 'Upload evidence documents on the <a href="https://ukticonnect.sharepoint.com/int-ti/Value/FDI-teamsite/Pages/default.aspx" aria-labelledby="external-link-label">Evidence teamsite</a> <span id="external-link-label">(will open another website)</span>',
    },
  ],
}

function buildFormLinks (forms, links) {
  const formLinks = []

  forEach(forms, (formName) => {
    formLinks.push(get(links, formName))
  })

  return formLinks
}

function buildIncompleteFormList (incompleteFields = [], formContents = formFields, links = linkDetails) {
  let forms = []

  forEach(incompleteFields, (incompleteField) => {
    forEach(formContents, (formFields, key) => {
      if (indexOf(formFields, incompleteField) !== -1) {
        forms.push(key)
      }
    })
  })

  return buildFormLinks(uniq(forms), links)
}

module.exports = {
  buildIncompleteFormList,
  toCompleteStageMessages,
}

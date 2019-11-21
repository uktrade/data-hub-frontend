var companiesNoResults = require('../../../fixtures/v4/company/companies-no-results.json')
var companyArchivedSubsidiaries = require('../../../fixtures/v4/company/company-archived-subsidiaries.json')
var company = require('../../../fixtures/v4/company/company.json')
var companyArchived = require('../../../fixtures/v4/company/company-archived.json')
var companyDnBCorp = require('../../../fixtures/v4/company/company-dnb-corp.json')
var companyDnBLtd = require('../../../fixtures/v4/company/company-dnb-ltd.json')
var companyDnBGlobalUltimate = require('../../../fixtures/v4/company/company-dnb-global-ultimate.json')
var companyDnBGlobalUltimateAndGlobalHq = require('../../../fixtures/v4/company/company-dnb-global-ultimate-and-global-hq.json')
var companyDnBGlobalUltimateSubsidiaries = require('../../../fixtures/v4/company/company-dnb-global-ultimate-subsidaries.json')
var companyInvestigationLtd = require('../../../fixtures/v4/company/company-investigation-ltd.json')
var companyLambdaPlc = require('../../../fixtures/v4/company/company-lambda-plc.json')
var companyMarsExportsLtd = require('../../../fixtures/v4/company/company-mars-exports-ltd.json')
var companyMinimallyMinimal = require('../../../fixtures/v4/company/company-minimally-minimal.json')
var companyOneListCorp = require('../../../fixtures/v4/company/company-one-list-corp.json')
var companySomeOtherCompany = require('../../../fixtures/v4/company/company-some-other-company.json')
var companyWithInvestment1 = require('../../../fixtures/v4/company/company-with-investment-1.json')
var companyWithInvestment2 = require('../../../fixtures/v4/company/company-with-investment-2.json')
var companyWithContacts = require('../../../fixtures/v4/company/company-with-contacts.json')
var companyList = require('../../../fixtures/v4/user/company-list.json')
var companyOneListTierDIta = require('../../../fixtures/v4/company/company-one-list-tier-d-ita.json')

var largeCapitalProfileEmpty = require('../../../fixtures/v4/company/large-capital-profile-empty.json')
var largeCapitalProfileNew = require('../../../fixtures/v4/company/large-capital-profile-new.json')
var largeCapitalProfile = require('../../../fixtures/v4/company/large-capital-profile.json')
var largeCapitalProfileCreateError = require('../../../fixtures/v4/company/large-capital-profile-post-create-error.json')
var largeCapitalProfileCreateSuccess = require('../../../fixtures/v4/company/large-capital-profile-post-create-success.json')
var largeCapitalProfileList10 = require('../../../fixtures/v4/investment/large-capital-profile-list10.json')
var largeCapitalProfileList20 = require('../../../fixtures/v4/investment/large-capital-profile-list20.json')

state.investor_description = state.investor_description || ''

exports.largeInvestorProfile = function (req, res) {
  console.log(req.query.offset)
  console.log(req)
  if (req.query.investor_company_id === companyOneListCorp.id) {
    return res.json(largeCapitalProfile)
  }
  if (req.query.investor_company_id === companyLambdaPlc.id) {
    return res.json(largeCapitalProfileNew)
  }
  if (req.query.investor_company_id === undefined && req.query.offset === '10') {
    return res.json(largeCapitalProfileList20)
  }
  if (req.query.investor_company_id === undefined && req.query.offset === '0') {
    return res.json(largeCapitalProfileList10)
  }
  res.json(largeCapitalProfileEmpty)
}

exports.largeInvestorProfilePatched = function (req, res) {
  res.json(largeCapitalProfile)
}

exports.largeInvestorProfilePostCreate = function (req, res) {
  if (req.body.investor_company === '400094ac-f79a-43e5-9c88-059a7baa17f3') {
    return res.json(400, largeCapitalProfileCreateError)
  }

  res.json(largeCapitalProfileCreateSuccess)
}

exports.companies = function (req, res) {
  var subsidiaries = {
    '346f78a5-1d23-4213-b4c2-bf48246a13c3': companyArchivedSubsidiaries,
    '079942718': companyDnBGlobalUltimateSubsidiaries,
  }

  if (req.query.global_headquarters_id) {
    res.json(subsidiaries[req.query.global_headquarters_id])
  } else if (req.query.global_ultimate_duns_number) {
    res.json(subsidiaries[req.query.global_ultimate_duns_number])
  } else {
    res.json(companiesNoResults)
  }
}

exports.company = function (req, res) {
  var companies = {
    '4cd4128b-1bad-4f1e-9146-5d4678c6a018': company,
    '346f78a5-1d23-4213-b4c2-bf48246a13c3': companyArchived,
    'cc7e2f19-7251-4a41-a27a-f98437720531': companyDnBCorp,
    's07e2f19-8251-1a41-h27a-f98737520831': companyDnBLtd,
    'd27bde24-6330-464b-a48c-0394831586fd': companyDnBGlobalUltimate,
    '0418f79f-154b-4f55-85a6-8ddad559663e': companyDnBGlobalUltimateAndGlobalHq,
    'ca8fae21-2895-47cf-90ba-9273c94dab81': companyInvestigationLtd,
    '0fb3379c-341c-4da4-b825-bf8d47b26baa': companyLambdaPlc,
    'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd': companyMarsExportsLtd,
    '149475d4-13a0-e511-88b6-e4115bead28a': companyMinimallyMinimal,
    '375094ac-f79a-43e5-9c88-059a7caa17f0': companyOneListCorp,
    'ca8fae21-2895-47cf-90ba-9273c94dab92': companySomeOtherCompany,
    '0f5216e0-849f-11e6-ae22-56b6b6499611': companyWithInvestment1,
    'a73efeba-8499-11e6-ae22-56b6b6499611': companyWithInvestment2,
    '0f5216e0-849f-11e6-ae22-56b6b6499622': companyWithContacts,
    'w2c34b41-1d5a-4b4b-7685-7c53ff2868dg': companyOneListTierDIta,
    'not-managed': _.assign({}, company, {
      name: 'Not Managed Company',
      id: 'not-managed',
    }),
    'managed': _.assign({}, company, {
      name: 'Managed Company',
      id: 'managed',
      one_list_group_global_account_manager: {
        name: 'Andy Pipkin',
        dit_team: {
          name: 'Little Britain',
        },
      },
    }),
  }

  res.json(companies[req.params.companyId] || company)
}

exports.companyPatched = function (req, res) {
  res.json(company)
}

exports.getCompanyList = function (req, res) {
  if (req.params.companyId === '0fb3379c-341c-4da4-b825-bf8d47b26baa') {
    return res.json(204, {})
  } else if (req.params.companyId === 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd') {
    return res.json(404, {})
  }
  res.json(200, companyList)
}

exports.advisersAdd = function (req, res) {
  return res.json(204, {})
}

var companiesNoResults = require('../../../fixtures/v4/company/companies-no-results.json')
var companyArchivedSubsidiaries = require('../../../fixtures/v4/company/company-archived-subsidiaries')
var company = require('../../../fixtures/v4/company/company.json')
var companyArchived = require('../../../fixtures/v4/company/company-archived.json')
var companyAutomaticallyArchived = require('../../../fixtures/v4/company/company-archived-automatically.json')
var companyDnBCorp = require('../../../fixtures/v4/company/company-dnb-corp.json')
var companyDnBSubsidiary = require('../../../fixtures/v4/company/company-dnb-subsidiary.json')
var companyDnBLtd = require('../../../fixtures/v4/company/company-dnb-ltd.json')
var companyDnBGlobalUltimate = require('../../../fixtures/v4/company/company-dnb-global-ultimate.json')
var companyDnBGlobalUltimateAndGlobalHq = require('../../../fixtures/v4/company/company-dnb-global-ultimate-and-global-hq.json')
var companyDnBGlobalUltimateSubsidiaries = require('../../../fixtures/v4/company/company-dnb-global-ultimate-subsidaries')
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
var companyWithValidationError = require('../../../fixtures/v4/company/company-validation-error.json')
var companyAudit = require('../../../fixtures/v4/company-audit/company-audit.json')
var exportWins = require('../../../fixtures/v4/company-export-wins/export-wins.json')
var exportWinsPage1 = require('../../../fixtures/v4/company-export-wins/export-wins-page-1.json')
var exportWinsPage2 = require('../../../fixtures/v4/company-export-wins/export-wins-page-2.json')
var companyCreateInvestigation = require('../../../fixtures/v4/dnb/company-create-investigation.json')

var largeCapitalProfileEmpty = require('../../../fixtures/v4/company/large-capital-profile-empty.json')
var largeCapitalProfileNew = require('../../../fixtures/v4/company/large-capital-profile-new.json')
var largeCapitalProfile = require('../../../fixtures/v4/company/large-capital-profile.json')
var largeCapitalProfileCreateError = require('../../../fixtures/v4/company/large-capital-profile-post-create-error.json')
var largeCapitalProfileCreateSuccess = require('../../../fixtures/v4/company/large-capital-profile-post-create-success.json')
var largeCapitalProfileList10 = require('../../../fixtures/v4/investment/large-capital-profile-list10.json')
var largeCapitalProfileList20 = require('../../../fixtures/v4/investment/large-capital-profile-list20.json')

var referralDetails = require('../../../fixtures/v4/referrals/referral-details.json')
var referralDetailsNoContact = require('../../../fixtures/v4/referrals/referral-details-no-contact.json')

var oneListGroupCoreTeam = require('../../../fixtures/v4/company/one-list-group-core-team.json')

var ReferralIds = require('../../../constants/referrals')

var companyWithExternalActivities = require('../../../fixtures/v4/company/company-with-external-activities.json')

const waterSector = 'ae22c9d2-5f95-e211-a939-e4115bead28a'

state.investor_description = state.investor_description || ''

exports.largeInvestorProfile = function (req, res) {
  if (req.query.investor_company_id === companyOneListCorp.id) {
    return res.json(largeCapitalProfile)
  }
  if (req.query.investor_company_id === companyLambdaPlc.id) {
    return res.json(largeCapitalProfileNew)
  }
  if (
    req.query.investor_company_id === undefined &&
    req.query.offset === '10'
  ) {
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

  if (
    req.query.global_headquarters_id &&
    req.query.global_headquarters_id in subsidiaries
  ) {
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
    '246g78a5-1d43-4213-b4c2-bf48246a13c4': companyAutomaticallyArchived,
    'cc7e2f19-7251-4a41-a27a-f98437720532': companyDnBSubsidiary,
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
    '4e6a4edb-55e3-4461-a88d-84d329ee7eb8': companyWithValidationError,
    '6df487c5-7c75-4672-8907-f74b49e6c635': companyWithExternalActivities,
    'not-managed': _.assign({}, company, {
      name: 'Not Managed Company',
      id: 'not-managed',
    }),
    managed: _.assign({}, company, {
      name: 'Managed Company',
      id: 'managed',
      one_list_group_global_account_manager: {
        name: 'Andy Pipkin',
        dit_team: {
          name: 'Andy & Lou',
        },
      },
    }),
    'managed-no-team': _.assign({}, company, {
      name: 'Managed Company With No Team',
      id: 'managed-no-team',
      one_list_group_global_account_manager: {
        name: 'Andy Pipkin',
      },
    }),
  }

  if (req.body.sector == waterSector) {
    // Simulate a 504 error
    return res.sendStatus(504)
  }

  if (!req.params.companyId) {
    return res.json(companyCreateInvestigation)
  }

  res.json(companies[req.params.companyId] || company)
}

exports.companyPatched = function (req, res) {
  if (req.body.sector === '9738cecc-5f95-e211-a939-e4115bead28a') {
    return res.json(companySomeOtherCompany)
  }

  if (req.body.sector == waterSector) {
    // Simulate a 504 error
    return res.sendStatus(504)
  }

  res.json(company)
}

exports.getCompanyList = function (req, res) {
  if (req.params.companyId === '0fb3379c-341c-4da4-b825-bf8d47b26baa') {
    return res.status(204).json({})
  } else if (req.params.companyId === 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd') {
    return res.status(404).json({})
  }
  res.status(200).json(companyList)
}

exports.manageAdviser = function (req, res) {
  return res.json(204, {})
}

exports.companyAudit = function (req, res) {
  res.json(companyAudit)
}

exports.exportWins = function (req, res) {
  var companyId = req.params.companyId

  if (companyId === companyLambdaPlc.id) {
    res.status(501).send('')
  } else if (companyId === companyMinimallyMinimal.id) {
    res.status(500).send('')
  } else if (companyId === companyInvestigationLtd.id) {
    res.status(502).send('')
  } else if (companyId === companyOneListCorp.id) {
    res.status(404).send('Not found')
  } else if (companyId === companyMarsExportsLtd.id) {
    if (req.query.offset) {
      return res.json(exportWinsPage2)
    }
    res.json(exportWinsPage1)
  } else {
    res.json(exportWins)
  }
}

exports.referralDetails = function (req, res) {
  if (req.params.id === ReferralIds.REFERRAL_ID_NO_CONTACT) {
    return res.json(referralDetailsNoContact)
  }
  if (req.params.id === 'completed') {
    return res.json(
      _.merge({}, referralDetailsNoContact, {
        status: 'complete',
        completed_on: '2020-03-19T10:38:00.841Z',
        completed_by: {
          name: 'Andy Pipkin',
          contact_email: 'andy.pipkin@little.britain.co.uk',
          dit_team: {
            name: 'Andy & Lou',
          },
        },
        interaction: {
          subject: 'Covert action',
          id: 'foo-bar-baz',
        },
      })
    )
  }
  return res.json(referralDetails)
}

exports.exportDetail = function (req, res) {
  var companyId = req.params.companyId

  if (companyId === companyLambdaPlc.id) {
    res.status(500).send('')
  } else if (companyId === companyDnBCorp.id) {
    res.status(400).json({ non_field_errors: ['A 400 error message here'] })
  } else {
    res.send('')
  }
}

exports.getOneListGroupCoreTeam = function (req, res) {
  var companyId = req.params.companyId

  if (companyId === companyMinimallyMinimal.id) {
    res.send('')
  } else {
    res.json(oneListGroupCoreTeam)
  }
}

exports.postOneListTierAndGlobalAccountManager = function (req, res) {
  res.send('')
}

exports.postRemoveFromOneList = function (req, res) {
  res.send('')
}

exports.patchOneListCoreTeam = function (req, res) {
  res.send('')
}

import companyNoOverviewDetails from '../../../fixtures/v4/company/company-no-overview-details.json' with { type: 'json' }
import companyAllOverviewDetails from '../../../fixtures/v4/company/company-all-overview-details.json' with { type: 'json' }
import companiesNoResults from '../../../fixtures/v4/company/companies-no-results.json' with { type: 'json' }
import companyArchivedSubsidiaries from '../../../fixtures/v4/company/company-archived-subsidiaries.js'
import company from '../../../fixtures/v4/company/company.json' with { type: 'json' }
import companyArchived from '../../../fixtures/v4/company/company-archived.json' with { type: 'json' }
import companyAutomaticallyArchived from '../../../fixtures/v4/company/company-archived-automatically.json' with { type: 'json' }
import companyDnBCorp from '../../../fixtures/v4/company/company-dnb-corp.json' with { type: 'json' }
import companyDnBSubsidiary from '../../../fixtures/v4/company/company-dnb-subsidiary.json' with { type: 'json' }
import companyDnBLtd from '../../../fixtures/v4/company/company-dnb-ltd.json' with { type: 'json' }
import companyDnBGlobalUltimate from '../../../fixtures/v4/company/company-dnb-global-ultimate.json' with { type: 'json' }
import companyDnBGlobalUltimateAndGlobalHq from '../../../fixtures/v4/company/company-dnb-global-ultimate-and-global-hq.json' with { type: 'json' }
import companyDnBGlobalUltimateSubsidiaries from '../../../fixtures/v4/company/company-dnb-global-ultimate-subsidaries.js'
import companyInvestigationLtd from '../../../fixtures/v4/company/company-investigation-ltd.json' with { type: 'json' }
import companyLambdaPlc from '../../../fixtures/v4/company/company-lambda-plc.json' with { type: 'json' }
import companyMarsExportsLtd from '../../../fixtures/v4/company/company-mars-exports-ltd.json' with { type: 'json' }
import companyMinimallyMinimal from '../../../fixtures/v4/company/company-minimally-minimal.json' with { type: 'json' }
import companyOneListCorp from '../../../fixtures/v4/company/company-one-list-corp.json' with { type: 'json' }
import companySomeOtherCompany from '../../../fixtures/v4/company/company-some-other-company.json' with { type: 'json' }
import companyWithInvestment1 from '../../../fixtures/v4/company/company-with-investment-1.json' with { type: 'json' }
import companyWithInvestment2 from '../../../fixtures/v4/company/company-with-investment-2.json' with { type: 'json' }
import companyWithContacts from '../../../fixtures/v4/company/company-with-contacts.json' with { type: 'json' }
import companyList from '../../../fixtures/v4/user/company-list.json' with { type: 'json' }
import companyOneListTierDIta from '../../../fixtures/v4/company/company-one-list-tier-d-ita.json' with { type: 'json' }
import companyWithValidationError from '../../../fixtures/v4/company/company-validation-error.json' with { type: 'json' }
import companyAudit from '../../../fixtures/v4/company-audit/company-audit.json' with { type: 'json' }
import companyUsState from '../../../fixtures/v4/company/company-us-state.json' with { type: 'json' }
import companyCanadianProvince from '../../../fixtures/v4/company/company-canada-province.json' with { type: 'json' }
import companyWithExportProjectDetails from '../../../fixtures/v4/company/company-with-export-project-details.json' with { type: 'json' }
import exportWins from '../../../fixtures/v4/company-export-wins/export-wins.json' with { type: 'json' }
import exportWinsPage1 from '../../../fixtures/v4/company-export-wins/export-wins-page-1.json' with { type: 'json' }
import exportWinsPage2 from '../../../fixtures/v4/company-export-wins/export-wins-page-2.json' with { type: 'json' }
import exportWinsNoWins from '../../../fixtures/v4/company-export-wins/export-wins-no-wins.json' with { type: 'json' }
import companyCreateInvestigation from '../../../fixtures/v4/dnb/company-create-investigation.json' with { type: 'json' }
import companyWithNoGlobalAccountManager from '../../../fixtures/v4/company/company-with-no-global-account-manager.json' with { type: 'json' }
import companyWithAllActivities from '../../../fixtures/v4/company/company-with-all-activities.json' with { type: 'json' }
import companyWithManyContacts from '../../../fixtures/v4/company/company-with-many-contacts.json' with { type: 'json' }
import companyWithEssInteractionNoTitle from '../../../fixtures/v4/company/company-with-ess-interactions.json' with { type: 'json' }
import largeCapitalProfileEmpty from '../../../fixtures/v4/company/large-capital-profile-empty.json' with { type: 'json' }
import largeCapitalProfileNew from '../../../fixtures/v4/company/large-capital-profile-new.json' with { type: 'json' }
import largeCapitalProfile from '../../../fixtures/v4/company/large-capital-profile.json' with { type: 'json' }
import largeCapitalProfileCreateError from '../../../fixtures/v4/company/large-capital-profile-post-create-error.json' with { type: 'json' }
import largeCapitalProfileCreateSuccess from '../../../fixtures/v4/company/large-capital-profile-post-create-success.json' with { type: 'json' }
import largeCapitalProfileList10 from '../../../fixtures/v4/investment/large-capital-profile-list10.json' with { type: 'json' }
import largeCapitalProfileList20 from '../../../fixtures/v4/investment/large-capital-profile-list20.json' with { type: 'json' }
import referralDetails from '../../../fixtures/v4/referrals/referral-details.json' with { type: 'json' }
import referralDetailsNoContact from '../../../fixtures/v4/referrals/referral-details-no-contact.json' with { type: 'json' }
import oneListGroupCoreTeam from '../../../fixtures/v4/company/one-list-group-core-team.json' with { type: 'json' }
import { REFERRAL_ID_NO_CONTACT } from '../../../constants/referrals.js'
import companyWithExternalActivities from '../../../fixtures/v4/company/company-with-external-activities.json' with { type: 'json' }

const waterSector = 'ae22c9d2-5f95-e211-a939-e4115bead28a'

export const largeInvestorProfile = function (req, res) {
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

export const largeInvestorProfilePatched = function (req, res) {
  res.json(largeCapitalProfile)
}

export const largeInvestorProfilePostCreate = function (req, res) {
  if (req.body.investor_company === '400094ac-f79a-43e5-9c88-059a7baa17f3') {
    return res.status(400).json(largeCapitalProfileCreateError)
  }

  res.json(largeCapitalProfileCreateSuccess)
}

export const companies = function (req, res) {
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

export const getCompany = function (req, res) {
  var companies = {
    '4cd4128b-1bad-4f1e-9146-5d4678c6a018': company,
    '346f78a5-1d23-4213-b4c2-bf48246a13c3': companyArchived,
    '246g78a5-1d43-4213-b4c2-bf48246a13c4': companyAutomaticallyArchived,
    'cc7e2f19-7251-4a41-a27a-f98437720532': companyDnBSubsidiary,
    'cc7e2f19-7251-4a41-a27a-f98437720531': companyDnBCorp,
    's07e2f19-8251-1a41-h27a-f98737520831': companyDnBLtd,
    'ba8fae21-2895-47cf-90ba-9273c94dab88': companyAllOverviewDetails,
    '1111ae21-2895-47cf-90ba-9273c94dab88': companyNoOverviewDetails,
    'd27bde24-6330-464b-a48c-0394831586fd': companyDnBGlobalUltimate,
    '0418f79f-154b-4f55-85a6-8ddad559663e': companyDnBGlobalUltimateAndGlobalHq,
    'ca8fae21-2895-47cf-90ba-9273c94dab81': companyInvestigationLtd,
    '0fb3379c-341c-4da4-b825-bf8d47b26baa': companyLambdaPlc,
    'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd': companyMarsExportsLtd,
    '149475d4-13a0-e511-88b6-e4115bead28a': companyMinimallyMinimal,
    '375094ac-f79a-43e5-9c88-059a7caa17f0': companyOneListCorp,
    'ca8fae21-2895-47cf-90ba-9273c94dab92': companySomeOtherCompany,
    '0f5216e0-849f-11e6-ae22-56b6b6499611': companyWithInvestment1,
    'ba3h7106-56af-40e0-8615-7aba53e0e4bf': companyWithNoGlobalAccountManager,
    'a73efeba-8499-11e6-ae22-56b6b6499611': companyWithInvestment2,
    '0f5216e0-849f-11e6-ae22-56b6b6499622': companyWithContacts,
    'w2c34b41-1d5a-4b4b-7685-7c53ff2868dg': companyOneListTierDIta,
    '4e6a4edb-55e3-4461-a88d-84d329ee7eb8': companyWithValidationError,
    '6df487c5-7c75-4672-8907-f74b49e6c635': companyWithExternalActivities,
    'b2c34b41-1d5a-4b4b-9249-7c53ff2868ab': companyUsState,
    'b319d019-444a-4d2f-9e76-c70f84bb22f6': companyCanadianProvince,
    'c79ba298-106e-4629-aa12-61ec6e2e47ce': companyWithAllActivities,
    '57c41268-26be-4335-a873-557e8b0deb29': companyWithManyContacts,
    'c79ba298-106e-4629-aa12-61ec6e2e47be': companyWithEssInteractionNoTitle,
    'not-managed': _.assign({}, getCompany, {
      name: 'Not Managed Company',
      id: 'not-managed',
    }),
    managed: _.assign({}, getCompany, {
      name: 'Managed Company',
      id: 'managed',
      one_list_group_global_account_manager: {
        name: 'Andy Pipkin',
        dit_team: {
          name: 'Andy & Lou',
        },
      },
    }),
    'managed-no-team': _.assign({}, getCompany, {
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

export const companyPatched = function (req, res) {
  if (req.body.sector === '9738cecc-5f95-e211-a939-e4115bead28a') {
    return res.json(companySomeOtherCompany)
  }

  if (req.body.sector == waterSector) {
    // Simulate a 504 error
    return res.sendStatus(504)
  }

  res.json(company)
}

export const getCompanyList = function (req, res) {
  if (req.params.companyId === '0fb3379c-341c-4da4-b825-bf8d47b26baa') {
    return res.status(204).json({})
  } else if (req.params.companyId === 'b2c34b41-1d5a-4b4b-9249-7c53ff2868dd') {
    return res.status(404).json({})
  }
  res.status(200).json(companyList)
}

export const manageAdviser = function (req, res) {
  return res.status(204).json({})
}

export const getCompanyAudit = function (req, res) {
  res.json(companyAudit)
}

export const getExportWins = function (req, res) {
  var companyId = req.params.companyId

  if (companyId === companyLambdaPlc.id) {
    res.status(501).send('')
  } else if (companyId === companyMinimallyMinimal.id) {
    res.status(500).send('')
  } else if (companyId === companyInvestigationLtd.id) {
    res.status(502).send('')
  } else if (companyId === companyOneListCorp.id) {
    res.status(404).send('Not found')
  } else if (companyId === companyNoOverviewDetails.id) {
    res.json(exportWinsNoWins)
  } else if (companyId === companyMarsExportsLtd.id) {
    if (req.query.offset) {
      return res.json(exportWinsPage2)
    }
    res.json(exportWinsPage1)
  } else {
    res.json(exportWins)
  }
}

export const getReferralDetails = function (req, res) {
  if (req.params.id === REFERRAL_ID_NO_CONTACT) {
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

export const exportDetail = function (req, res) {
  var companyId = req.params.companyId
  var exportId = req.params.exportId

  var errorResponse = { non_field_errors: ['A 400 error message here'] }

  if (companyId === companyLambdaPlc.id) {
    res.status(500).send('')
  } else if (companyId === companyDnBCorp.id) {
    res.status(400).json(errorResponse)
  } else if (exportId === companyWithExportProjectDetails.id) {
    res.json(companyWithExportProjectDetails)
  } else {
    res.status(400).json(errorResponse)
  }
}

export const getOneListGroupCoreTeam = function (req, res) {
  var companyId = req.params.companyId

  if (companyId === companyMinimallyMinimal.id) {
    res.send('[]')
  } else {
    res.json(oneListGroupCoreTeam)
  }
}

export const postOneListTierAndGlobalAccountManager = function (req, res) {
  res.send('')
}

export const postRemoveFromOneList = function (req, res) {
  res.send('')
}

export const patchOneListCoreTeam = function (req, res) {
  res.send('')
}

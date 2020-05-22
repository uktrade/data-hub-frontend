const { getOptions } = require('../../../../lib/options')
const { parseAdviserData } = require('../../../../client/utils/formatAdviser')
const { getOneListGroupCoreTeam } = require('../../repos')
const { filterOneListTiers, getTeamMembers } = require('./transformers')
const {
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} = require('./constants')

async function renderEditOneList(req, res) {
  const { token } = req.session
  const { company } = res.locals

  const [oneListTiers, oneListTeam] = await Promise.all([
    getOptions(token, 'one-list-tier', { sorted: false }),
    getOneListGroupCoreTeam(token, company.id),
  ])

  const oneListGroupTier = company.one_list_group_tier
    ? company.one_list_group_tier.id
    : null

  const oneListGroupGlobalAccountManager = company.one_list_group_global_account_manager
    ? parseAdviserData([company.one_list_group_global_account_manager])[0]
    : null

  const oneListCoreTeam = oneListTeam
    ? parseAdviserData(getTeamMembers(oneListTeam))
    : null

  const formInitialValues = {
    [TIER_FIELD_NAME]: oneListGroupTier,
    [ACCOUNT_MANAGER_FIELD_NAME]: oneListGroupGlobalAccountManager,
    [ONE_LIST_TEAM_FIELD_NAME]: oneListCoreTeam,
  }

  res.locals.title = `Edit One List information - ${company.name} - Companies`
  res.render('companies/apps/edit-one-list/views/client-container', {
    props: {
      companyId: company.id,
      companyName: company.name,
      oneListTiers: filterOneListTiers(oneListTiers),
      oneListGroupTier,
      oneListGroupGlobalAccountManager,
      oneListCoreTeam,
      formInitialValues,
    },
  })
}

module.exports = {
  renderEditOneList,
}

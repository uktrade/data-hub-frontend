const { getOneListGroupCoreTeam } = require('../repos')
const config = require('../../../config')
const { transformCoreTeamToCollection } = require('../transformers')
const { coreTeamLabels } = require('../labels')
const { isItaTierDAccount } = require('../../../lib/is-tier-type-company')

function renderLeadAdvisers (req, res) {
  const { company, user: { permissions } } = res.locals
  const { name } = company
  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Lead Advisers')
    .render('companies/views/lead-advisers', {
      props: {
        company: name,
        pageUrl: `/companies/${company.id}/advisers/confirm`,
        hasPermission: permissions.includes('company.change_regional_account_manager'),
        isItaTierDAccount: isItaTierDAccount(company),
      },
    })
}

async function renderCoreTeamAdvisers (req, res, next) {
  try {
    const { company } = res.locals
    const token = req.session.token
    const { global_account_manager: globalAccountManager, adviser_on_core_team: adviserOnCoreTeam, location, team } = coreTeamLabels
    const columns = {
      'global_account_manager': {
        team,
        location,
        name: globalAccountManager,
      },
      'adviser_core_team': {
        team,
        location,
        name: adviserOnCoreTeam,
      },
    }
    const coreTeam = await getOneListGroupCoreTeam(token, company.id)
      .then(transformCoreTeamToCollection)
    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Advisers')
      .render('companies/views/advisers', {
        coreTeam,
        columns,
        oneListEmail: config.oneList.email,
        companyName: company.name,
      })
  } catch (error) {
    next(error)
  }
}

async function renderAdvisers (req, res, next) {
  const { company, features } = res.locals
  features.lead_advisers && (isItaTierDAccount(company) || company.one_list_group_tier === null)
    ? renderLeadAdvisers(req, res)
    : await renderCoreTeamAdvisers(req, res, next)
}

module.exports = {
  renderAdvisers,
}

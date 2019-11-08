const { getOneListGroupCoreTeam } = require('../../../repos')
const config = require('../../../../../config')
const { transformCoreTeamToCollection, transformAccountManager } = require('../../../transformers')
const { coreTeamLabels } = require('../../../labels')
const { isItaTierDAccount } = require('../../../../../lib/is-tier-type-company')
const { companies } = require('../../../../../../src/lib/urls')

function renderLeadAdvisers (req, res) {
  const { company, user: { permissions } } = res.locals
  const hasAccountManager = !!company.one_list_group_global_account_manager
  const { name = null, team = null, email = null } = hasAccountManager ? transformAccountManager(company) : {}

  res
    .breadcrumb(company.name, `${companies.detail(company.id)}`)
    .breadcrumb('Lead adviser')
    .render('companies/views/lead-advisers', {
      props: {
        hasAccountManager,
        name,
        team,
        email,
        companyName: company.name,
        companyId: company.id,
        confirmUrl: `${companies.advisers.confirm(company.id)}`,
        replaceUrl: `${companies.advisers.replace(company.id)}`,
        hasPermissionToAddIta: permissions.includes('company.change_regional_account_manager'),
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

function addAdviserForm (req, res) {
  const { company, csrfToken } = res.locals
  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Confirm you are the Lead ITA')
    .render('companies/views/add-adviser.njk', {
      props: { csrfToken },
    })
}

async function addAdviser (req, res, next) {
  const { company, user } = res.locals
  const nextUrl = '/companies/' + company.id
  try {
    // TODO: Call the endpoint here
    console.log('ADDING ADVISER', user.id, company.id)
    req.flash('success', 'Adviser added')
    res.redirect(nextUrl)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
  addAdviser,
  addAdviserForm,
}

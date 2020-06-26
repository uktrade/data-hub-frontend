const { get } = require('lodash')
const { getOneListGroupCoreTeam } = require('../../../repos')
const config = require('../../../../../config')
const { transformCoreTeamToCollection } = require('../../../transformers')
const { coreTeamLabels } = require('../../../labels')
const { isItaTierDAccount } = require('../../../../../lib/is-tier-type-company')
const { authorisedRequest } = require('../../../../../lib/authorised-request')
const urls = require('../../../../../lib/urls')

const companyToLeadITA = ({ one_list_group_global_account_manager: leadITA }) =>
  leadITA && {
    name: leadITA.name,
    email: leadITA.contact_email,
    team: get(leadITA, 'dit_team.name'),
  }

function renderLeadAdvisers(req, res) {
  const {
    company,
    user: { permissions },
    returnUrl,
    dnbRelatedCompaniesCount,
  } = res.locals
  const { name, team, email } = companyToLeadITA(company) || {}

  res.render('companies/views/lead-advisers', {
    props: {
      hasAccountManager: !!company.one_list_group_global_account_manager,
      name,
      team,
      email,
      companyName: company.name,
      companyId: company.id,
      addUrl: urls.companies.advisers.assign(company.id),
      removeUrl: urls.companies.advisers.remove(company.id),
      hasPermissionToAddIta: permissions.includes(
        'company.change_regional_account_manager'
      ),
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(company.id), text: company.name },
        { text: 'Lead adviser' },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
      flashMessages: res.locals.getMessages(),
    },
  })
}

async function renderCoreTeamAdvisers(req, res, next) {
  try {
    const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
    const token = req.session.token
    const {
      global_account_manager: globalAccountManager,
      adviser_on_core_team: adviserOnCoreTeam,
      location,
      team,
    } = coreTeamLabels
    const columns = {
      global_account_manager: {
        team,
        location,
        name: globalAccountManager,
      },
      adviser_core_team: {
        team,
        location,
        name: adviserOnCoreTeam,
      },
    }
    const coreTeam = await getOneListGroupCoreTeam(token, company.id).then(
      transformCoreTeamToCollection
    )
    res.render('companies/views/advisers', {
      coreTeam,
      columns,
      oneListEmail: config.oneList.email,
      companyName: company.name,
      props: {
        company,
        breadcrumbs: [
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.companies.index(), text: 'Companies' },
          { link: urls.companies.detail(company.id), text: company.name },
          { text: 'Core Team' },
        ],
        returnUrl,
        dnbRelatedCompaniesCount,
        flashMessages: res.locals.getMessages(),
      },
    })
  } catch (error) {
    next(error)
  }
}

async function renderAdvisers(req, res, next) {
  const { company } = res.locals
  isItaTierDAccount(company) || company.one_list_group_tier === null
    ? renderLeadAdvisers(req, res)
    : await renderCoreTeamAdvisers(req, res, next)
}

// istanbul ignore next: Covered by functional tests
const form = (req, res) => {
  const {
    company: { name, id },
  } = res.locals
  const isRemove = req.url === '/remove'
  const currentLeadITA = companyToLeadITA(res.locals.company)
  res.render('companies/apps/advisers/views/manage-adviser.njk', {
    props: {
      companyName: name,
      companyId: id,
      isRemove,
      currentLeadITA,
      cancelUrl: urls.companies.advisers.index(id),
    },
  })
}

// istanbul ignore next: Covered by functional tests
async function submit(req, res, next) {
  const {
    company: { id },
  } = res.locals

  try {
    await authorisedRequest(req.session.token, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company/${id}/remove-account-manager`,
    })

    req.flash('success', 'Lead adviser information updated')
    res.redirect(urls.companies.advisers.index(id))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
  submit,
  form,
}

const { get } = require('lodash')
const config = require('../../../../../config')
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

  res.locals.title = `Lead adviser - ${company.name} - Companies`

  res.render('companies/views/lead-advisers', {
    props: {
      companyId: company.id,
      returnUrl,
      dnbRelatedCompaniesCount,
      flashMessages: res.locals.getMessages(),
      localNavItems: res.locals.localNavItems,
      permissions,
    },
  })
}

async function renderCoreTeamAdvisers(req, res, next) {
  try {
    const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
    const companyId = company.id

    res.render('companies/views/advisers', {
      props: {
        companyId,
        returnUrl,
        dnbRelatedCompaniesCount,
        flashMessages: res.locals.getMessages(),
        localNavItems: res.locals.localNavItems,
        oneListEmail: config.oneList.email,
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
      cancelUrl: urls.companies.accountManagement.index(id),
    },
  })
}

// istanbul ignore next: Covered by functional tests
async function submit(req, res, next) {
  const {
    company: { id },
  } = res.locals

  try {
    await authorisedRequest(req, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company/${id}/remove-account-manager`,
    })

    req.flash('success', 'Lead adviser information updated')
    res.redirect(urls.companies.accountManagement.index(id))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
  submit,
  form,
}

const { get } = require('lodash')

const urls = require('../../../../lib/urls')
const { authorisedRequest } = require('../../../../lib/authorised-request')
const config = require('../../../../config')

const companyToLeadITA = ({ one_list_group_global_account_manager: leadITA }) =>
  leadITA && {
    name: leadITA.name,
    email: leadITA.contact_email,
    team: get(leadITA, 'dit_team.name'),
  }

async function renderAccountManagement(req, res) {
  const { company, dnbRelatedCompaniesCount, localNavItems, returnUrl } =
    res.locals
  const permissions = res.locals.user.permissions

  res.render('companies/apps/account-management/views/client-container', {
    props: {
      dnbRelatedCompaniesCount,
      permissions,
      localNavItems: localNavItems,
      flashMessages: res.locals.getMessages(),
      companyId: company.id,
      returnUrl: returnUrl,
    },
  })
}

// istanbul ignore next: Covered by functional tests
const form = (req, res) => {
  const {
    company: { name, id },
  } = res.locals
  const isRemove = req.url.endsWith('/remove')
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
  renderAccountManagement,
  submit,
  form,
}

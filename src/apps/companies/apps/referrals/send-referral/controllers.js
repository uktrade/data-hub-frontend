const urls = require('../../../../../lib/urls')
const { authorisedRequest } = require('../../../../../lib/authorised-request')
const { omit } = require('lodash')
const config = require('../../../../../config/index')

function renderSendReferralForm(req, res) {
  const {
    company: { contacts, name, id },
  } = res.locals
  const companyContacts = contacts.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`,
    id: id,
  }))
  res
    .breadcrumb(name, urls.companies.detail(id))
    .breadcrumb('Send a referral')
    .render(
      'companies/apps/referrals/send-referral/views/client-container.njk',
      {
        heading: 'Send a referral',
        props: {
          companyContacts,
          companyName: name,
          companyId: id,
          cancelUrl: urls.companies.detail(id),
        },
      }
    )
}

async function submitSendReferralForm(req, res, next) {
  try {
    await authorisedRequest(req.session.token, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company-referral`,
      body: omit(req.body, '_csrf'),
    })
    req.flashWithBody(
      'success',
      'Referral sent.',
      `You can <a href="${urls.dashboard()}">see all of your referrals on your Homepage</a>.`
    )
    res.redirect(urls.companies.detail(res.locals.company.id))
  } catch (error) {
    next(error)
  }
}

module.exports = { renderSendReferralForm, submitSendReferralForm }

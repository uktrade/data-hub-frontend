const { omit } = require('lodash')

const urls = require('../../../../../lib/urls')
const { authorisedRequest } = require('../../../../../lib/authorised-request')
const config = require('../../../../../config/index')

function renderSendReferralForm(req, res) {
  const {
    company: { contacts, name, id },
  } = res.locals
  const companyContacts = contacts.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`,
    id: id,
  }))
  const sendingAdviserTeamName =
    req.session.user && req.session.user.dit_team
      ? req.session.user.dit_team.name
      : ''
  res.locals.title = `Send a referral - ${name} - Companies`
  res.render(
    'companies/apps/referrals/send-referral/views/client-container.njk',
    {
      props: {
        companyContacts,
        companyName: name,
        companyId: id,
        cancelUrl: urls.companies.detail(id),
        sendingAdviserTeamName,

        // TODO: This should not be necessary as flashMessages are included in global props
        // flashMessages: res.locals.flashMessages,
      },
    }
  )
}

async function submitSendReferralForm(req, res, next) {
  try {
    await authorisedRequest(req, {
      method: 'POST',
      url: `${config.apiRoot}/v4/company-referral`,
      body: omit(req.body, '_csrf'),
    })
    req.flashWithBody(
      'success',
      'Referral sent.',
      `You can <a href="${urls.companies.referrals.list()}">see all of your referrals on your Homepage</a>.`
    )
    res.redirect(urls.companies.detail(res.locals.company.id))
  } catch (error) {
    next(error)
  }
}

module.exports = { renderSendReferralForm, submitSendReferralForm }

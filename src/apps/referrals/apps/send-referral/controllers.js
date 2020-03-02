const urls = require('../../../../lib/urls')

function renderSendReferralForm(req, res) {
  const {
    company: { contacts, name, id },
  } = res.locals
  const companyContacts = contacts.map(({ first_name, last_name, id }) => ({
    name: `${first_name} ${last_name}`,
    id: id,
  }))
  res
    .breadcrumb(name, `/companies/${id}`)
    .breadcrumb('Send a referral')
    .render('referrals/apps/send-referral/views/client-container.njk', {
      heading: 'Send a referral',
      props: {
        companyContacts,
        companyName: name,
        companyId: id,
        cancelUrl: urls.companies.detail(id),
      },
    })
}
module.exports = renderSendReferralForm

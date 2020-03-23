const urls = require('../../../../../lib/urls')

const renderReferralHelp = ({ params: { referralId } }, res) => {
  const {
    company: { name: companyName, id },
  } = res.locals

  res
    .breadcrumb(companyName, urls.companies.detail(id))
    .breadcrumb('Referral', urls.companies.referrals.details(id, referralId))
    .breadcrumb('I cannot accept this referral')
    .render('companies/apps/referrals/help/views/help-container', {
      heading: 'I cannot accept this referral',
      props: {
        referralId,
      },
    })
}

module.exports = renderReferralHelp

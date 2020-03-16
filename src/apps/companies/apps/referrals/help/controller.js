const urls = require('../../../../../lib/urls')

const renderReferralHelp = ({ params: { referralId } }, res) => {
  const {
    company: { name: companyName, id },
  } = res.locals

  res
    .breadcrumb(companyName, urls.companies.detail(id))
    .breadcrumb('Referral', urls.companies.referrals.details(id, referralId))
    .breadcrumb('Help')
    .render('companies/apps/referrals/help/views/help-container', {
      heading: 'Help to complete this Referral',
      props: {
        referralId,
      },
    })
}

module.exports = renderReferralHelp

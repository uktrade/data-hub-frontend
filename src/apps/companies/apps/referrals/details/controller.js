const urls = require('../../../../../lib/urls')

const renderReferralDetails = ({ params: { referralId } }, res) => {
  const {
    company: { name: companyName, id },
  } = res.locals

  res
    .breadcrumb(companyName, urls.companies.detail(id))
    .breadcrumb('Referral')
    .render('companies/apps/referrals/details/views/details-container', {
      heading: 'Referral',
      props: {
        referralId,
      },
    })
}

module.exports = renderReferralDetails

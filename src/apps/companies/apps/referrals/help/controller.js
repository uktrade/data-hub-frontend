const urls = require('../../../../../lib/urls')

const renderReferralHelp = ({ params: { referralId } }, res) => {
  const { company } = res.locals

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb(
      'Referral',
      urls.companies.referrals.details(company.id, referralId)
    )
    .breadcrumb('I cannot accept this referral')
    .render('companies/apps/referrals/help/views/help-container', {
      heading: 'I cannot accept this referral',
      props: {
        referralId,
        companyId: company.id,
      },
    })
}

module.exports = renderReferralHelp

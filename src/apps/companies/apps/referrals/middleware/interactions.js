const { getReferral } = require('../repos')
const urls = require('../../../../../lib/urls')

async function setReferralDetails(req, res, next) {
  try {
    res.locals.referral = await getReferral(req, req.params.referralId)
    next()
  } catch (error) {
    next(error)
  }
}

function setInteractionsDetails(req, res, next) {
  const { referralId } = req.params
  const { company } = res.locals
  res.locals.interactions = {
    returnLink: urls.companies.referrals.details(company.id, referralId),
    referralId: referralId,
    canAdd: true,
    showCompany: true,
  }
  res.breadcrumb([
    {
      text: `${company.name}`,
      href: urls.companies.detail(company.id),
    },
    {
      text: 'Referral',
      href: urls.companies.referrals.details(company.id, referralId),
    },
  ])
  next()
}

module.exports = {
  setInteractionsDetails,
  setReferralDetails,
}

const { getReferral } = require('../repos')
const urls = require('../../../../../lib/urls')

async function setCompanyDetails(req, res, next) {
  try {
    const referral = await getReferral(req.session.token, req.params.referralId)
    res.locals.company = referral.company
    res.locals.contact = referral.contact
    next()
  } catch (error) {
    next(error)
  }
}

function setInteractionsDetails(req, res, next) {
  const { referralId } = req.params
  const { company } = res.locals
  res.locals.interactions = {
    returnLink: urls.companies.referrals.interactionsIndex(
      company.id,
      referralId
    ),
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
  ]),
    next()
}

module.exports = {
  setInteractionsDetails,
  setCompanyDetails,
}

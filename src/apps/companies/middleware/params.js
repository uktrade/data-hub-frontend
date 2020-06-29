const {
  getDitCompany,
  addDitCompanyToList,
  getDitCompanyFromList,
  removeDitCompanyFromList,
} = require('../repos')
const config = require('../../../config')

const { isItaTierDAccount } = require('../../../lib/is-tier-type-company')

async function getCompany(req, res, next, id) {
  try {
    const { features } = res.locals
    const company = await getDitCompany(req.session.token, id)
    company.isItaTierDAccount = isItaTierDAccount(company)
    company.hasAllocatedLeadIta =
      company.one_list_group_global_account_manager != null
    company.hasManagedAccountDetails =
      company.one_list_group_tier && company.hasAllocatedLeadIta
    company.isUltimate =
      !!company.is_global_ultimate && features['companies-ultimate-hq']
    company.isGlobalHQ =
      company.headquarter_type && company.headquarter_type.name === 'ghq'

    if (config.accountPlanUrls[company.duns_number]) {
      company.account_plan_url = config.accountPlanUrls[company.duns_number]
    }

    res.locals.company = company
    next()
  } catch (error) {
    next(error)
  }
}

async function setIsCompanyAlreadyAdded(req, res, next, id) {
  let isCompanyAlreadyAdded = false
  try {
    await getDitCompanyFromList(req.session.token, id)
    isCompanyAlreadyAdded = true
  } catch (error) {
    //  Do nothing
  }
  res.locals.isCompanyAlreadyAdded = isCompanyAlreadyAdded
  next()
}

const companyListActions = {
  add: async (req, res, next, companyId) => {
    await addDitCompanyToList(req.session.token, companyId)
    req.flash(
      'success',
      'This company has been added to your list of companies. You can find this list on your Data Hub Home page. Only you can see this list.'
    )
  },
  remove: async (req, res, next, companyId) => {
    await removeDitCompanyFromList(req.session.token, companyId)
    req.flash('success', 'This company has been removed from your list.')
  },
}

async function addCompanyOrRemoveFromList(req, res, next) {
  const companyId = res.locals.company.id
  try {
    await companyListActions[req.body.action](req, res, next, companyId)
    res.redirect(`${req.baseUrl}/${companyId}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompany,
  setIsCompanyAlreadyAdded,
  addCompanyOrRemoveFromList,
}

const { get } = require('lodash')

const {
  getDitCompany,
  addDitCompanyToList,
  getDitCompanyFromList,
  removeDitCompanyFromList,
  getCHCompany,
} = require('../repos')

const { getAllCompanyLists } = require('../../company-lists/repos')

async function getCompany (req, res, next, id) {
  try {
    res.locals.company = await getDitCompany(req.session.token, id)
    next()
  } catch (error) {
    next(error)
  }
}

async function setIsCompanyAlreadyAdded (req, res, next, id) {
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

async function setDoAnyListsExist (req, res, next, id) {
  const userPermissions = get(res, 'locals.user.permissions')
  res.locals.canViewCompanyList = userPermissions.includes(
    'company_list.view_companylist'
  )
  if (res.locals.canViewCompanyList) {
    let listsExist = false
    try {
      const { count } = await getAllCompanyLists(req.session.token)
      listsExist = count > 0
      res.locals.listsExist = listsExist
    } catch (error) {
      next(error)
    }
  }
  next()
}

const companyListActions = {
  add: async (req, res, next, companyId) => {
    await addDitCompanyToList(req.session.token, companyId)
    req.flash('success', 'This company has been added to your list of companies. You can find this list on your Data Hub Home page. Only you can see this list.')
  },
  remove: async (req, res, next, companyId) => {
    await removeDitCompanyFromList(req.session.token, companyId)
    req.flash('success', 'This company has been removed from your list.')
  },
}

async function addCompanyOrRemoveFromList (req, res, next) {
  const companyId = res.locals.company.id
  try {
    await companyListActions[req.body.action](req, res, next, companyId)
    res.redirect(`${req.baseUrl}/${companyId}`)
  } catch (error) {
    next(error)
  }
}

async function getCompaniesHouseRecord (req, res, next, companyNumber) {
  try {
    const companiesHouseRecord = await getCHCompany(req.session.token, companyNumber)
    res.locals.companiesHouseCategory = companiesHouseRecord.company_category
    res.locals.companiesHouseRecord = companiesHouseRecord
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompany,
  setIsCompanyAlreadyAdded,
  setDoAnyListsExist,
  addCompanyOrRemoveFromList,
  getCompaniesHouseRecord,
}

const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

async function fetchCompanyList(req, res, next) {
  const { listId } = req.params
  try {
    res.locals.companyList = await getCompanyList(req, listId)
    next()
  } catch (error) {
    next(error)
  }
}

function renameCompanyList(req, name, id) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company-list/${id}`,
    method: 'PATCH',
    body: {
      id,
      name,
    },
  })
}

function createUserCompanyList(req, id, name) {
  return authorisedRequest(req, {
    method: 'POST',
    url: `${config.apiRoot}/v4/company-list`,
    body: {
      id,
      name,
    },
  })
}

function getListsCompanyIsIn(req, id) {
  return authorisedRequest(req, {
    method: 'GET',
    url: `${config.apiRoot}/v4/company-list?items__company_id=${id}`,
  })
}

function getAllCompanyLists(req) {
  return authorisedRequest(req, `${config.apiRoot}/v4/company-list`)
}

function getCompanyList(req, id) {
  return authorisedRequest(req, `${config.apiRoot}/v4/company-list/${id}`)
}

function deleteCompanyList(req, id) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company-list/${id}`,
    method: 'DELETE',
  })
}

function addCompanyToList(req, listId, companyId) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company-list/${listId}/item/${companyId}`,
    method: 'PUT',
  })
}

function removeCompanyFromList(req, listId, companyId) {
  return authorisedRequest(req, {
    url: `${config.apiRoot}/v4/company-list/${listId}/item/${companyId}`,
    method: 'DELETE',
  })
}

module.exports = {
  addCompanyToList,
  removeCompanyFromList,
  deleteCompanyList,
  getCompanyList,
  getAllCompanyLists,
  getListsCompanyIsIn,
  createUserCompanyList,
  fetchCompanyList,
  renameCompanyList,
}

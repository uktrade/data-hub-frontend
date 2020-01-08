const config = require('../../config')
const { authorisedRequest } = require('../../lib/authorised-request')

async function fetchCompanyList(req, res, next) {
  const { token } = req.session
  const { listId } = req.params
  try {
    res.locals.companyList = await getCompanyList(token, listId)
    next()
  } catch (error) {
    next(error)
  }
}

function renameCompanyList(token, name, id) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company-list/${id}`,
    method: 'PATCH',
    body: {
      id,
      name,
    },
  })
}

function createUserCompanyList(token, id, name) {
  return authorisedRequest(token, {
    method: 'POST',
    url: `${config.apiRoot}/v4/company-list`,
    body: {
      id,
      name,
    },
  })
}

function getListsCompanyIsIn(token, id) {
  return authorisedRequest(token, {
    method: 'GET',
    url: `${config.apiRoot}/v4/company-list?items__company_id=${id}`,
  })
}

function getAllCompanyLists(token) {
  return authorisedRequest(token, `${config.apiRoot}/v4/company-list`)
}

function getCompanyList(token, id) {
  return authorisedRequest(token, `${config.apiRoot}/v4/company-list/${id}`)
}

function deleteCompanyList(token, id) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company-list/${id}`,
    method: 'DELETE',
  })
}

function addCompanyToList(token, listId, companyId) {
  return authorisedRequest(token, {
    url: `${config.apiRoot}/v4/company-list/${listId}/item/${companyId}`,
    method: 'PUT',
  })
}

function removeCompanyFromList(token, listId, companyId) {
  return authorisedRequest(token, {
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

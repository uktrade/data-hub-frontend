import filteredCompanyLists from '../../../fixtures/v4/company-list/filtered-company-lists.json' with { type: 'json' }
import companyLists from '../../../fixtures/v4/company-list/company-lists.json' with { type: 'json' }
import companyListsDB from '../../../fixtures/v4/company-list/company-lists-db.json' with { type: 'json' }
import multipleItemCompanyList from '../../../fixtures/v4/company-list/single-list-with-multiple-items.json' with { type: 'json' }
import errorOnDeleteCompanyList from '../../../fixtures/v4/company-list/single-list-with-error-on-delete.json' with { type: 'json' }

const LAMBDA_COMPANY_ID = '0fb3379c-341c-4da4-b825-bf8d47b26baa'

export const getCompanyLists = function (req, res) {
  if (req.query.items__company_id == LAMBDA_COMPANY_ID) {
    return res.json(filteredCompanyLists)
  }
  return res.json(companyLists)
}

export const getCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyList.id) {
    res.json(multipleItemCompanyList)
    return
  }

  if (req.params.listId === errorOnDeleteCompanyList.id) {
    res.json(errorOnDeleteCompanyList)
    return
  }

  res.sendStatus(404)
}

export const getCompanyListItems = function (req, res) {
  return res.json(
    companyListsDB[req.params.listId] || {
      count: 0,
      next: null,
      previous: null,
      results: [],
    }
  )
}

export const createCompanyList = function (req, res) {
  res.sendStatus(201)
}

export const deleteCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyList.id) {
    res.sendStatus(204)
    return
  }

  res.sendStatus(404)
}

export const editCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyList.id) {
    res.sendStatus(204)
    return
  }

  res.sendStatus(404)
}

export const addCompanyToList = function (req, res) {
  res.sendStatus(204)
}

export const removeCompanyFromList = function (req, res) {
  res.sendStatus(204)
}

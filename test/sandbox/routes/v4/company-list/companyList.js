import companyListJson from '../../../fixtures/v4/company-list/company-list.json' assert { type: 'json' };
import filteredCompanyListsJson from '../../../fixtures/v4/company-list/filtered-company-lists.json' assert { type: 'json' };
import companyListsJson from '../../../fixtures/v4/company-list/company-lists.json' assert { type: 'json' };
import companyListsDBJson from '../../../fixtures/v4/company-list/company-lists-db.json' assert { type: 'json' };
import multipleItemCompanyListJson from '../../../fixtures/v4/company-list/single-list-with-multiple-items.json' assert { type: 'json' };
import errorOnDeleteCompanyListJson from '../../../fixtures/v4/company-list/single-list-with-error-on-delete.json' assert { type: 'json' };

const LAMBDA_COMPANY_ID = '0fb3379c-341c-4da4-b825-bf8d47b26baa'

export const companyList = function (req, res) {
  res.json(companyListJson)
};

export const getCompanyLists = function (req, res) {
  if (req.query.items__company_id == LAMBDA_COMPANY_ID) {
    return res.json(filteredCompanyListsJson)
  }
  return res.json(companyListsJson)
};

export const getCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyListJson.id) {
    res.json(multipleItemCompanyListJson)
    return
  }

  if (req.params.listId === errorOnDeleteCompanyListJson.id) {
    res.json(errorOnDeleteCompanyListJson)
    return
  }

  res.sendStatus(404)
};

export const getCompanyListItems = function (req, res) {
  return res.json(
    companyListsDBJson[req.params.listId] || {
      count: 0,
      next: null,
      previous: null,
      results: [],
    }
  )
};

export const createCompanyList = function (req, res) {
  res.sendStatus(201)
};

export const deleteCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyListJson.id) {
    res.sendStatus(204)
    return
  }

  res.sendStatus(404)
};

export const editCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyListJson.id) {
    res.sendStatus(204)
    return
  }

  res.sendStatus(404)
};

export const addCompanyToList = function (req, res) {
  res.sendStatus(204)
};

export const removeCompanyFromList = function (req, res) {
  res.sendStatus(204)
};

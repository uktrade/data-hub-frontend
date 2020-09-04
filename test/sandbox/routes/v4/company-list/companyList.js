var companyList = require('../../../fixtures/v4/company-list/company-list.json')
var companyLists = require('../../../fixtures/v4/company-list/company-lists.json')
var companyListsDB = require('../../../fixtures/v4/company-list/company-lists-db.json')
var multipleItemCompanyList = require('../../../fixtures/v4/company-list/single-list-with-multiple-items.json')
var errorOnDeleteCompanyList = require('../../../fixtures/v4/company-list/single-list-with-error-on-delete.json')

exports.companyList = function (req, res) {
  res.json(companyList)
}

exports.getCompanyLists = function (req, res) {
  res.json(companyLists)
}

exports.getCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyList.id) {
    res.json(multipleItemCompanyList)
    return
  }

  if (req.params.listId === errorOnDeleteCompanyList.id) {
    res.json(errorOnDeleteCompanyList)
    return
  }

  res.send(404)
}

exports.getCompanyListItems = function (req, res) {
  return res.json(
    companyListsDB[req.params.listId] || {
      count: 0,
      next: null,
      previous: null,
      results: [],
    }
  )
}

exports.createCompanyList = function (req, res) {
  res.send(201)
}

exports.deleteCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyList.id) {
    res.send(204)
    return
  }

  res.send(404)
}

exports.editCompanyList = function (req, res) {
  if (req.params.listId === multipleItemCompanyList.id) {
    res.send(204)
    return
  }

  res.send(404)
}

const { searchContacts } = require('../search/services')
const { buildPagination } = require('../../lib/pagination')
const { transformContactToListItem } = require('./transformers')
const { transformFieldsObjectToMacrosObject } = require('../transformers')

async function getContactsCollection (req, res, next) {
  const page = parseInt(req.query.page, 10) || 1

  try {
    res.locals.results = await searchContacts({
      token: req.session.token,
      requestBody: req.body,
      limit: 10,
      page,
    })
      .then(result => {
        result.items = result.items
          .map(transformContactToListItem)
          .map(item => {
            item.meta = transformFieldsObjectToMacrosObject(item.meta, {
              macroName: 'MetaItem',
            })
            return item
          })
        result.pagination = buildPagination(req.query, result)
        return result
      })

    next()
  } catch (error) {
    next(error)
  }
}

function getRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null

  req.body = Object.assign({}, req.body, selectedSortBy)

  next()
}

module.exports = {
  getContactsCollection,
  getRequestBody,
}

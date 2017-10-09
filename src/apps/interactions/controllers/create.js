const { pick, kebabCase } = require('lodash')
const queryString = require('query-string')
const { selectKindFormConfig } = require('../macros')

function postCreate (req, res, next) {
  const kind = req.body.kind || null

  if (!kind) {
    res.locals.errors = {
      messages: {
        kind: ['You must select an interaction type'],
      },
    }
    return next()
  }

  const interactionData = pick(req.query, 'contact', 'company', 'investment', 'returnLink')
  const createQueryString = queryString.stringify(interactionData)

  return res.redirect(`/interactions/create/${kebabCase(kind)}?${createQueryString}`)
}

function renderCreate (req, res) {
  const selectKindForm = selectKindFormConfig({
    errors: res.locals.errors || [],
  })

  res
    .breadcrumb('Add interaction or service')
    .render('interactions/views/create.njk', {
      selectKindForm,
    })
}

module.exports = {
  renderCreate,
  postCreate,
}

const { pick, lowerCase } = require('lodash')
const queryString = require('query-string')
const { selectKindFormConfig } = require('../macros')

function postStep1 (req, res, next) {
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

  return res.redirect(`/interactions/create/${lowerCase(kind)}?${createQueryString}`)
}

function renderStep1 (req, res) {
  const selectKindForm = selectKindFormConfig({
    errors: res.locals.errors || [],
  })

  res
    .breadcrumb('Add interaction/service')
    .render('interactions/views/add-step-1.njk', {
      selectKindForm,
    })
}

module.exports = {
  renderStep1,
  postStep1,
}

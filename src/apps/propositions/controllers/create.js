const { kebabCase } = require('lodash')
const { kindForm } = require('../macros')

function postCreate (req, res, next) {
  const kind = req.body.kind || null

  if (!kind) {
    res.locals.errors = {
      messages: {
        kind: ['You must select an proposition type'],
      },
    }
    return next()
  }
  return res.redirect(`${res.locals.returnLink}create/${kebabCase(kind)}`)
}

function renderCreate (req, res) {
  const selectKindForm = kindForm({
    errors: res.locals.errors || [],
  })

  res
    .breadcrumb('Add proposition or service')
    .render('propositions/views/create.njk', {
      selectKindForm,
    })
}

module.exports = {
  renderCreate,
  postCreate,
}

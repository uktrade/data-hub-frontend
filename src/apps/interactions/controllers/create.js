const { kebabCase } = require('lodash')
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
  return res.redirect(`${res.locals.returnLink}create/${kebabCase(kind)}`)
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

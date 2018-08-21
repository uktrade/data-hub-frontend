const { get, kebabCase } = require('lodash')
const { kindForm } = require('../macros')

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
  return res.redirect(`${res.locals.interactions.returnLink}create/${kebabCase(kind)}`)
}

function renderCreate (req, res) {
  const selectKindForm = kindForm({
    errors: res.locals.errors || [],
    permissions: get(req, 'session.user.permissions'),
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

const { get, kebabCase } = require('lodash')
const { kindForm } = require('../macros')

const kindLookup = {
  export_interaction: {
    kind: 'interaction',
    theme: 'export',
  },
  export_service_delivery: {
    kind: 'service_delivery',
    theme: 'export',
  },
  other_interaction: {
    kind: 'interaction',
    theme: 'other',
  },
  other_service_delivery: {
    kind: 'service_delivery',
    theme: 'other',
  },
  other: {
    kind: 'interaction',
    theme: 'investment',
  },
}

function postCreate (req, res, next) {
  const kindType = (req.body.kind_export || req.body.kind_other) || null

  if (!req.body.theme) {
    res.locals.errors = {
      messages: {
        kind: ['You must select an interaction type'],
      },
    }
    return next()
  }

  if ((!req.body.kind_export && !req.body.kind_other) && req.body.theme !== 'investment_interaction') {
    res.locals.errors = {
      messages: {
        kind: ['You must select what you would like to record'],
      },
    }
    return next()
  }

  const { kind, theme } = kindLookup[kindType] || kindLookup.other

  return res.redirect(`${res.locals.interactions.returnLink}create/${kebabCase(theme)}/${kebabCase(kind)}`)
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

const { get } = require('lodash')
const { kindForm } = require('../macros')
const { joinPaths } = require('../../../lib/path')

const { THEMES, KINDS } = require('../constants')

const kindLookup = {
  export_interaction: {
    kind: KINDS.INTERACTION,
    theme: THEMES.EXPORT,
  },
  export_service_delivery: {
    kind: KINDS.SERVICE_DELIVERY,
    theme: THEMES.EXPORT,
  },
  other_interaction: {
    kind: KINDS.INTERACTION,
    theme: THEMES.OTHER,
  },
  other_service_delivery: {
    kind: KINDS.SERVICE_DELIVERY,
    theme: THEMES.OTHER,
  },
  other: {
    kind: KINDS.INTERACTION,
    theme: THEMES.INVESTMENT,
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
  const path = joinPaths(
    [
      res.locals.interactions.returnLink,
      req.params.interactionId,
      req.params.interactionId ? 'edit' : 'create',
      theme,
      kind,
    ]
  )

  return res.redirect(path)
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

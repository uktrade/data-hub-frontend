const { abandonForm } = require('../macros')

function postAbandon (req, res, next) {
  const kind = req.body.kind || null

  if (!kind) {
    res.locals.errors = {
      messages: {
        kind: ['Text area cannot be empty'],
      },
    }
    return next()
  }
  return res.redirect(`${res.locals.returnLink}`)
}

function renderAbandon (req, res) {
  const { proposition } = res.locals
  const selectAbandonForm = abandonForm({
    errors: res.locals.errors || [],
  })

  res
    .breadcrumb('Abandon Proposition')
    .title(proposition.name)
    .render('propositions/views/abandon.njk', {
      selectAbandonForm,
    })
}

module.exports = {
  renderAbandon,
  postAbandon,
}

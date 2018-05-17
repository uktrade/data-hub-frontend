const { kebabCase } = require('lodash')
// const { kindForm } = require('../macros')
const { abandonForm } = require('../macros')

function postCreate (req, res, next) {
  const kind = req.body.kind || null

  console.log('~~~~~~~~~~~~ postCreate ~~~~~~~~~~~ ', res.locals.returnLink )

  if (!kind) {
    res.locals.errors = {
      messages: {
        kind: ['You must select a proposition type'],
      },
    }
    return next()
  }

  return res.redirect(`${res.locals.returnLink}create/${kebabCase(kind)}`)
}

// TODO(jf): create createForm

function renderCreate (req, res) {
  const selectKindForm = abandonForm({
    errors: res.locals.errors || [],
  })

  console.log('~~~~~~~~~~~~ renderCreate ~~~~~~~~~~~ ', res.locals.returnLink )

  res
    .breadcrumb('Add proposition or service')
    .render('propositions/views/create.njk', {
      selectKindForm,
    })
}

// function renderAbandon (req, res) {
//   const { proposition } = res.locals
//   const selectAbandonForm = abandonForm({
//     errors: res.locals.errors || [],
//   })
//
//   res
//     .breadcrumb('Abandon Proposition')
//     .title(proposition.name)
//     .render('propositions/views/abandon.njk', {
//       selectAbandonForm,
//     })
// }

function renderComplete (req, res) {
  const { proposition } = res.locals
  const selectCompleteForm = completeForm({
    errors: res.locals.errors || [],
  })

  res
    .breadcrumb('Complete Proposition')
    .title(proposition.name)
    .render('propositions/views/abandon.njk', {
      selectCompleteForm,
    })
}

module.exports = {
  // renderAbandon,
  renderCreate,
  postCreate,
}

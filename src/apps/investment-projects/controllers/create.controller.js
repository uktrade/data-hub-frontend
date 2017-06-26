function createGetHandler (req, res) {
  if (!res.locals.equityCompany) {
    return res.redirect('/investment/start')
  }
  return res.render('investment-projects/views/create', {
    title: 'Add investment project',
  })
}

function createPostHandler (req, res) {
  if (res.locals.form.errors) {
    return res.render('investment-projects/views/create', {
      title: 'Add investment project',
    })
  }
  return res.redirect(`/investment/${res.locals.resultId}`)
}

module.exports = {
  createGetHandler,
  createPostHandler,
}

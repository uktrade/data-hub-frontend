function render (req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create-2')
}

function createGetHandler (req, res) {
  if (!res.locals.equityCompany) {
    return res.redirect('/investment-projects/create/1')
  }
  return render(req, res)
}

function createPostHandler (req, res) {
  if (res.locals.form.errors) {
    return render(req, res)
  }
  return res.redirect(`/investment-projects/${res.locals.resultId}`)
}

module.exports = {
  createGetHandler,
  createPostHandler,
}

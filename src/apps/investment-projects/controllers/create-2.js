function render (res) {
  return res.render('investment-projects/views/create-2', {
    title: 'Add investment project',
  })
}

function createGetHandler (req, res) {
  if (!res.locals.equityCompany) {
    return res.redirect('/investment-projects/create/1')
  }
  return render(res)
}

function createPostHandler (req, res) {
  if (res.locals.form.errors) {
    return render(res)
  }
  return res.redirect(`/investment-projects/${res.locals.resultId}`)
}

module.exports = {
  createGetHandler,
  createPostHandler,
}

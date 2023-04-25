const { createUserCompanyList } = require('../repos')

async function createCompanyList(req, res, next) {
  const { id, name } = req.body
  try {
    await createUserCompanyList(req, id, name)
    res.send()
  } catch (error) {
    req.flash('error', 'Could not create list')
    next(error)
  }
}

async function renderCreateListForm(req, res, next) {
  const { company } = res.locals
  try {
    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Create new list')
      .render('company-lists/views/create-list-container', {
        heading: `Add ${company.name} to list`,
        props: {
          id: company.id,
          name: 'listName',
          label: 'What do you want to name your new list?',
          hint: 'This is a name only you see, and can be up to 30 characters long',
          cancelUrl: `/companies/${company.id}/lists/add-remove`,
          maxLength: 30,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderCreateListForm,
  createCompanyList,
}

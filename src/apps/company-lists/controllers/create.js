const { createUserCompanyList } = require('../repos')

async function createCompanyList(req, res, next) {
  const { id, name } = req.body
  try {
    await createUserCompanyList(req, id, name)
    req.flash('success', 'Company list created')
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
      .breadcrumb('Create a list')
      .render('company-lists/views/create-list-container', {
        props: {
          id: company.id,
          name: 'listName',
          label: 'List name',
          hint: 'This is a name only you see, and can be up to 30 characters',
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

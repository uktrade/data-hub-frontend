const { editCompanyList } = require('../repos')

async function handleEditCompanyList (req, res, next) {
  const { token } = req.session
  const { name, id } = req.body
  try {
    await editCompanyList(token, name, id)
    req.flash('success', 'List updated')
    res.send()
  } catch (error) {
    next(error)
  }
}

async function renderEditCompanyListPage (req, res, next) {
  const { companyList: { id, name } } = res.locals
  const props = {
    id,
    name: 'listName',
    label: 'List name',
    hint: 'This is a name only you see, and can be up to 30 characters',
    cancelUrl: `/`,
    maxLength: 30,
    listName: name,
    returnUrl: '/',
  }

  try {
    res.breadcrumb('Edit list name').render('company-lists/views/edit-list', {
      props,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEditCompanyListPage,
  handleEditCompanyList,
}

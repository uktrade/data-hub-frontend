const { deleteCompanyList } = require('../repos')

async function renderDeleteCompanyListPage(req, res, next) {
  const props = {
    companyList: res.locals.companyList,
    returnUrl: '/',
  }

  try {
    res.breadcrumb('Delete list').render('company-lists/views/delete-list', {
      props,
    })
  } catch (error) {
    next(error)
  }
}

async function handleDeleteCompanyList(req, res, next) {
  try {
    await deleteCompanyList(req, req.params.listId)
    req.flash('success', 'List deleted')
    res.send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleDeleteCompanyList,
  renderDeleteCompanyListPage,
}

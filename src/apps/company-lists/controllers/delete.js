const { deleteCompanyList, getCompanyList } = require('../repos')

async function fetchCompanyList (req, res, next) {
  try {
    res.locals.companyList = await getCompanyList(req.session.token, req.params.listId)
    next()
  } catch (error) {
    next(error)
  }
}

async function renderDeleteCompanyListPage (req, res, next) {
  const props = {
    companyList: res.locals.companyList,
    returnUrl: '/',
  }

  try {
    res
      .breadcrumb('Delete list')
      .render('company-lists/views/delete-list', {
        props,
      })
  } catch (error) {
    next(error)
  }
}

async function handleDeleteCompanyList (req, res, next) {
  try {
    await deleteCompanyList(req.session.token, req.params.listId)
    req.flash('success', 'List deleted')
    res.send()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  fetchCompanyList,
  handleDeleteCompanyList,
  renderDeleteCompanyListPage,
}

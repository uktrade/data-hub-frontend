const { renameCompanyList, getCompanyList } = require('../repos')
const urls = require('../../../lib/urls')
// istanbul ignore next: Covered by functional tests
async function handleEditCompanyList (req, res, next) {
  const { token } = req.session
  const { name, id } = req.body
  try {
    await renameCompanyList(token, name, id)
    req.flash('success', 'List updated')
    res.send()
  } catch (error) {
    next(error)
  }
}
// istanbul ignore next: Covered by functional tests
async function renderEditCompanyListPage (req, res, next) {
  const { token } = req.session
  const { listId } = req.params
  res.locals.companyList = await getCompanyList(token, listId)
  const { companyList: { id, name } } = res.locals
  const props = {
    id,
    cancelUrl: `${urls.dashboard()}`,
    listName: name,
    returnUrl: `${urls.dashboard()}`,
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

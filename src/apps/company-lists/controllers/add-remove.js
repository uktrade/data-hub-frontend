const {
  getAllCompanyLists,
  getListsCompanyIsIn,
  addCompanyToList,
  removeCompanyFromList,
} = require('../repos')
const { transformCompaniesInLists } = require('../transformers')
const urls = require('../../../lib/urls')

async function handleAddRemoveCompanyToList(req, res, next) {
  const { list } = req.body
  const { id } = res.locals.company
  const listsToUpdate = []
  try {
    for (const [listId, value] of Object.entries(list)) {
      const addOrRemoveCompany =
        value === 'yes' ? addCompanyToList : removeCompanyFromList
      listsToUpdate.push(addOrRemoveCompany(req, listId, id))
    }
    await Promise.all(listsToUpdate)
    req.flash('success', 'Lists changes for this company have been saved.')
    res.send()
  } catch (error) {
    req.flash('error', 'Could not add or remove to list')
    next(error)
  }
}

async function fetchListsCompanyIsOn(req, res, next) {
  try {
    const [allLists, allListsCompaniesIn] = await Promise.all([
      getAllCompanyLists(req),
      getListsCompanyIsIn(req, res.locals.company.id),
    ])
    res.locals.listsCompanyIsIn = await transformCompaniesInLists(
      allLists,
      allListsCompaniesIn
    )
    next()
  } catch (error) {
    next(error)
  }
}

async function renderAddRemoveForm(req, res, next) {
  const { company, listsCompanyIsIn, csrfToken } = res.locals
  const cancelLinkUrl = req.query.returnUrl || urls.dashboard()

  try {
    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Add and remove from lists')
      .render('company-lists/views/add-remove-list-container', {
        heading: `Add and remove ${company.name} from lists`,
        props: {
          list: listsCompanyIsIn,
          companyId: company.id,
          token: csrfToken,
          createNewListUrl: `/companies/${company.id}/lists/create`,
          cancelLinkUrl,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleAddRemoveCompanyToList,
  renderAddRemoveForm,
  fetchListsCompanyIsOn,
}

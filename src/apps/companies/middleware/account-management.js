const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { updateCompany } = require('../repos')

async function populateAccountManagementForm (req, res, next) {
  try {
    const advisers = await getAdvisers(req.session.token)
    res.locals.advisers = filterActiveAdvisers({ advisers: advisers.results })

    next()
  } catch (err) {
    next(err)
  }
}

async function postAccountManagementDetails (req, res, next) {
  const data = {
    one_list_account_owner: req.body.one_list_account_owner,
  }

  try {
    const result = await updateCompany(req.session.token, res.locals.company.id, data)

    req.flash('success', 'Account management details updated')

    res.redirect(`/companies/${result.id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  populateAccountManagementForm,
  postAccountManagementDetails,
}

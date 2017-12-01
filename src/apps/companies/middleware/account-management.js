const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')

async function populateAccountManagementForm (req, res, next) {
  try {
    const advisers = await getAdvisers(req.session.token)
    res.locals.advisers = filterActiveAdvisers({ advisers: advisers.results })

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  populateAccountManagementForm,
}

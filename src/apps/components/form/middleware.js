const { search, buildSearchEntityResultsData } = require('../../search/services')
const { buildFormWithErrors, buildFormWithState } = require('../../builders')
const { macros } = require('./constants')

function handleFormPost (req, res, next) {
  const formWithState = buildFormWithState(macros.standardForm, req.body)
  const formWithStateAndErrors = buildFormWithErrors(formWithState, {
    name: !req.body.name ? ['The name is not valid'] : null,
    firstName: !req.body.firstName ? ['Add first name pls'] : null,
    foreignOtherCompany: !req.body.foreignOtherCompany ? ['Select a company type'] : null,
  })

  res.locals.macros = {
    standardForm: formWithStateAndErrors,
  }

  next()
}

async function handleEntitySearch (req, res, next) {
  const searchTerm = req.query.term

  if (searchTerm) {
    const results = await search({
      searchTerm,
      token: req.session.token,
      searchEntity: 'company',
    })

    res.locals.entitySearch = Object.assign({}, res.locals.entitySearch, {
      searchEntityResultsData: buildSearchEntityResultsData(results.aggregations),
    })
  }
  next()
}

module.exports = {
  handleFormPost,
  handleEntitySearch,
}

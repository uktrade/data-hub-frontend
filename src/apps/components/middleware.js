const { search, buildSearchEntityResultsData } = require('../search/services')

function handleFormPost (req, res, next) {
  res.locals.form = Object.assign({}, res.locals.form, {
    state: req.body,
    errors: {
      summary: 'Please correct the following errors:',
      messages: {
        name: ['The name is not valid'],
        country: ['Country is required'],
        averageSalary: ['Select an option'],
        foreignOtherCompany: ['Select a company type'],
        estimated_date: ['Date is required'],
        land_date: ['Date is required'],
      },
    },
  })

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

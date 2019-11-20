const { fetchLargeCapitalProfiles } = require('../repos')
const { transformLargeCapitalProfiles } = require('../transformers/profiles')

const renderProfilesView = async (req, res, next) => {
  try {
    res
      .breadcrumb('Profiles')
      .render('investments/views/profiles', { heading: 'Investments' })
  } catch (error) {
    next(error)
  }
}

const fetchLargeCapitalProfilesHandler = async (req, res, next) => {
  try {
    const { token } = req.session
    const { page } = req.query

    const { count, results } = await fetchLargeCapitalProfiles(
      token,
      10,
      parseInt(page, 10)
    )

    res.json({
      count: count || 0,
      results: results ? results.map(transformLargeCapitalProfiles) : [],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { renderProfilesView, fetchLargeCapitalProfilesHandler }

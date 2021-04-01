let investmentProjects = require('../../../fixtures/v3/search/investment-project.json')
const { ZERO_INVESTMENT_PROJECTS } = require('../../../constants/dashboard')
const { addDays, subDays } = require('date-fns')

const STAGES = {
  VERIFY_WIN: '49b8f6f3-0c50-4150-a965-2c974f3149e3',
}

exports.investmentProjects = function (req, res) {
  const today = new Date()
  const oneFortnightAgo = subDays(today, 14)

  const hasFilters = !!(
    req.body.actual_land_date_before ||
    req.body.actual_land_date_after ||
    req.body.estimated_land_date_before ||
    req.body.estimated_land_date_after ||
    req.body.sector_descends ||
    req.body.country_investment_originates_from ||
    req.body.uk_region_location ||
    req.body.status ||
    req.body.adviser ||
    req.body.stage ||
    req.body.investment_type ||
    req.body.likelihood_to_land ||
    req.body.level_of_involvement_simplified
  )

  const currentResults = investmentProjects.results.map((result, i) => ({
    ...result,
    estimated_land_date: addDays(oneFortnightAgo, i * 14),
  }))

  if (
    req.body.adviser === ZERO_INVESTMENT_PROJECTS ||
    req.body.stage === STAGES.VERIFY_WIN
  ) {
    return res.json({
      count: 0,
      results: [],
    })
  } else if (req.body.uk_region_location) {
    var regionQuery = req.body.uk_region_location
    var regions = typeof regionQuery === 'string' ? [regionQuery] : regionQuery
    var ukRegionFilteredResults = _.filter(
      currentResults,
      function (investmentProject) {
        return _.intersection(
          regions,
          investmentProject.actual_uk_regions.map(function (region) {
            return region.id
          })
        ).length
      }
    )
    return res.json({
      count: ukRegionFilteredResults.length,
      results: ukRegionFilteredResults,
    })
  } else if (hasFilters) {
    return res.json({
      count: 12,
      results: currentResults,
    })
  } else {
    return res.json({
      ...investmentProjects,
      results: currentResults,
    })
  }
}

/**
 * Mock a simple csv file for export
 */
exports.export = function (req, res) {
  res.header('Content-Type', 'text/csv')
  res.attachment('export.csv')
  res.send('a,b,c\n1,2,3')
}

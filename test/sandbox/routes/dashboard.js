import homepage from '../fixtures/dashboard/homepage.json' with { type: 'json' }

export const dashboardHomepage = function (req, res) {
  res.json(homepage)
}

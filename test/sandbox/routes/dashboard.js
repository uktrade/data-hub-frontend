import homepage from '../fixtures/dashboard/homepage.json' assert { type: 'json' }

export const dashboardHomepage = function (req, res) {
  res.json(homepage)
}

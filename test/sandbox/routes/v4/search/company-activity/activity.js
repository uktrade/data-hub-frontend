import activity from '../../../../fixtures/v4/search/company-activity/activity-by-company-id.json' with { type: 'json' }

export const searchCompanyActivities = function (req, res) {
  return res.json(activity)
}

import activity from '../../../fixtures/v4/activity/activity-by-company-id.json' assert { type: 'json' }

export const searchCompanyActivities = function (req, res) {
  return res.json(activity)
}

var activities = require('../../../fixtures/v4/activity-feed/activities.json')
var noActivities = require('../../../fixtures/v4/activity-feed/no-activities.json')

exports.activityFeed = function (req, res) {
  var terms = req.body.query.bool.must[1].terms

  if (
    terms &&
    terms['object.attributedTo.id'][0] ===
      'dit:DataHubCompany:0f5216e0-849f-11e6-ae22-56b6b6499611'
  ) {
    return res.json(noActivities)
  }

  res.json(activities)
}

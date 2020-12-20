var { isEqual, startsWith, get } = require('lodash')

// External activities
var externalActivities = require('../../../fixtures/v4/activity-feed/external/external-activities.json')
var maxemailCampaignQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-query.json')
var maxemailCampaignActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-activities.json')
var maxemailEmailSentQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-query.json')
var maxemailEmailSentActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-activities.json')

// Data Hub and external activities
var dataHubAndExternalActivities = require('../../../fixtures/v4/activity-feed/data-hub-and-external-activities.json')

// My activities
var myActivities = require('../../../fixtures/v4/activity-feed/my-activities.json')

// Data Hub activities
var dataHubActivities = require('../../../fixtures/v4/activity-feed/data-hub-activities.json')
var noActivity = require('../../../fixtures/v4/activity-feed/no-activity.json')

const DATA_HUB_ACTIVITY = [
  'dit:Interaction',
  'dit:ServiceDelivery',
  'dit:InvestmentProject',
  'dit:OMISOrder',
  'dit:CompanyReferral',
]

const EXTERNAL_ACTIVITY = ['dit:Accounts', 'dit:Company', 'dit:Export']

const DATA_HUB_AND_EXTERNAL_ACTIVITY = [
  ...DATA_HUB_ACTIVITY,
  ...EXTERNAL_ACTIVITY,
]

const VENUS_LTD = 'dit:DataHubCompany:0f5216e0-849f-11e6-ae22-56b6b6499611'

exports.activityFeed = function (req, res) {
  // Data Hub activity
  var dataHubTypes = get(req.body, "query.bool.must[0].terms['object.type']")
  if (isEqual(dataHubTypes, DATA_HUB_ACTIVITY)) {
    var company = get(
      req.body,
      "query.bool.must[1].terms['object.attributedTo.id'][0]"
    )
    return res.json(company === VENUS_LTD ? noActivity : dataHubActivities)
  }

  // External activity
  var externalActivityTypes = get(
    req.body,
    "query.bool.filter.bool.should[0].bool.must[0].terms['object.type']"
  )
  if (isEqual(externalActivityTypes, EXTERNAL_ACTIVITY)) {
    return res.json(externalActivities)
  }

  // My activity
  var adviser = get(
    req.body,
    "query.bool.must[1].term['object.attributedTo.id']"
  )
  if (startsWith(adviser, 'dit:DataHubAdviser')) {
    return res.json(myActivities)
  }

  // Data Hub and external activity
  if (isEqual(externalActivityTypes, DATA_HUB_AND_EXTERNAL_ACTIVITY)) {
    return res.json(dataHubAndExternalActivities)
  }

  // Maxemail campaigns
  if (isEqual(maxemailCampaignQuery, req.body)) {
    return res.json(maxemailCampaignActivities)
  }

  // Maxemail emails sent
  if (isEqual(maxemailEmailSentQuery, req.body)) {
    return res.json(maxemailEmailSentActivities)
  }

  return res.json(noActivity)
}

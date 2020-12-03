const { isEmpty } = require('lodash')
var defaultFeatureFlags = require('../../../fixtures/v3/feature-flag/feature-flag.json')

let featureFlags = [...defaultFeatureFlags]

exports.featureFlag = function (req, res) {
  res.json(featureFlags.filter((x) => !isEmpty(x)))
}

exports.setSandboxFlag = function (req, res) {
  featureFlags['123'] = req.body
  res.json(featureFlags)
}

exports.resetSandboxFlags = function (req, res) {
  featureFlags = [...defaultFeatureFlags]
  res.json(featureFlags)
}

var defaultFeatureFlags = require('../../../fixtures/v3/feature-flag/feature-flag.json')

let featureFlags = { ...defaultFeatureFlags }

exports.featureFlag = function (req, res) {
  return res.json(defaultFeatureFlags)
}

exports.setSandboxFlag = function (req, res) {
  featureFlags[req.body.code] = req.body
  res.json(featureFlags)
}

exports.resetSandboxFlags = function (req, res) {
  featureFlags = { ...defaultFeatureFlags }
  res.json(featureFlags)
}

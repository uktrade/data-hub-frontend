var outstandingPropositions = require('../../../fixtures/v4/proposition/outstanding_propositions.json')

exports.propositions = function (req, res) {
  res.json(outstandingPropositions)
}

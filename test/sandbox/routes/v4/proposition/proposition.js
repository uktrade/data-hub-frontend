var outstandingPropositions = require('../../../fixtures/v4/proposition/outstanding_propositions.json')

exports.propositions = function (req, res) {
  outstandingPropositions.results = outstandingPropositions.results.map(
    ({ deadline, ...rest }, i) => {
      let newDeadline = new Date()
      newDeadline.setDate(newDeadline.getDate() + 3 * i)
      return {
        deadline: newDeadline,
        ...rest,
      }
    }
  )
  res.json(outstandingPropositions)
}

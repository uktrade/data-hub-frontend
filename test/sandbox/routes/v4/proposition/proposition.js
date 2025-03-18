import outstandingPropositions from '../../../fixtures/v4/proposition/outstanding_propositions.json' with { type: 'json' }

export const propositions = function (req, res) {
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

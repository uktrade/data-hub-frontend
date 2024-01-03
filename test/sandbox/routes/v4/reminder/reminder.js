import summary from '../../../fixtures/v4/reminder/summary.json' assert { type: 'json' }

export const getSummary = function (req, res) {
  res.json(summary)
}

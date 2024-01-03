import advisers from '../../../fixtures/v4/search/advisers.json' assert { type: 'json' }

export const searchAdvisers = function (req, res) {
  return res.json(advisers)
}

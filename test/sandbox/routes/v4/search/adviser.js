import advisers from '../../../fixtures/v4/search/advisers.json' with { type: 'json' }

export const searchAdvisers = function (req, res) {
  return res.json(advisers)
}

import advisersJson from '../../../fixtures/v4/search/advisers.json' assert { type: 'json' };

export const advisers = function (req, res) {
  return res.json(advisersJson)
};

import summaryJson from '../../../fixtures/v4/reminder/summary.json' assert { type: 'json' };

export const summary = function (req, res) {
  res.json(summaryJson)
};

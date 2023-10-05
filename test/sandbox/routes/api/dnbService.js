import companiesSearchJson from '../../fixtures/dnb/companies-search.json' assert { type: 'json' };

export const companiesSearch = function (req, res) {
  res.json(companiesSearchJson)
};

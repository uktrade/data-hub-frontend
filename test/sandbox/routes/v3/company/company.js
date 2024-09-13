// FIXME: Is this module used? All imports are non-existent
throw Error('IM NOT USED')

import companyArchivedSubsidiaries from '../../../fixtures/v3/company/company-archived-subsidiaries' //TODO check this location

export const companies = function (req, res) {
  var subsidiaries = {
    '346f78a5-1d23-4213-b4c2-bf48246a13c3': companyArchivedSubsidiaries,
  }

  res.json(subsidiaries[req.query.global_headquarters_id])
}

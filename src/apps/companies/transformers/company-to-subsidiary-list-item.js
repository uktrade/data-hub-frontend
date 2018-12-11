const transformCompanyToListItem = require('./company-to-list-item')

module.exports = function transformCompanyToSubsidiaryListItem ({ archived: globalHeadquartersArchived, duns_number: globalHeadquartersDunsNumber }) {
  return (company) => {
    const listItem = transformCompanyToListItem({
      ...company,
      global_headquarters_archived: globalHeadquartersArchived,
      global_headquarters_duns_number: globalHeadquartersDunsNumber,
    })
    listItem.meta = listItem.meta.filter(metaItem => metaItem.label !== 'Global HQ')
    return listItem
  }
}

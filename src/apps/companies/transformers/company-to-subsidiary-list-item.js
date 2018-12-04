const transformCompanyToListItem = require('./company-to-list-item')

module.exports = function transformCompanyToSubsidiaryListItem ({ archived: globalHeadquartersArchived }, DnB) {
  return (company) => {
    const listItem = transformCompanyToListItem({
      ...company,
      global_headquarters_archived: globalHeadquartersArchived,
      DnB,
    })
    listItem.meta = listItem.meta.filter(metaItem => metaItem.label !== 'Global HQ')
    return listItem
  }
}

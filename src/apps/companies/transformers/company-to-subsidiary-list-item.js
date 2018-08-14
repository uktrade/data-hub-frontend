const transformCompanyToListItem = require('./company-to-list-item')

module.exports = function transformCompanyToSubsidiaryListItem ({ archived: globalHeadquartersArchived }) {
  return (company) => {
    const listItem = transformCompanyToListItem({
      ...company,
      global_headquarters_archived: globalHeadquartersArchived,
    })
    listItem.meta = listItem.meta.filter(metaItem => metaItem.label !== 'Global HQ')
    return listItem
  }
}

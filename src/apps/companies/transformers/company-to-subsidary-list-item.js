const transformCompanyToListItem = require('./company-to-list-item')

module.exports = function transformCompanyToSubsidiaryListItem (company) {
  const listItem = transformCompanyToListItem(company)
  listItem.meta = listItem.meta.filter(metaItem => metaItem.label !== 'Global HQ')
  return listItem
}

const transformCompanyToListItem = require('./company-to-list-item')

module.exports = function transformCompanyToSubsidiaryListItem ({ archived: parentCompanyArchived }) {
  return (company) => {
    const listItem = transformCompanyToListItem({
      ...company,
      parentCompanyArchived,
    })
    listItem.meta = listItem.meta.filter(metaItem => metaItem.label !== 'Global HQ')
    return listItem
  }
}

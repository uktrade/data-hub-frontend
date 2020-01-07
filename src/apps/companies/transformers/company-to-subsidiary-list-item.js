const transformCompanyToListItem = require('./company-to-list-item')

module.exports = function transformCompanyToSubsidiaryListItem({
  archived: globalHeadquartersArchived,
}) {
  return (company) => {
    const listItem = transformCompanyToListItem(company)

    if (!globalHeadquartersArchived) {
      listItem.meta.push({
        value: 'Remove subsidiary',
        url: `/companies/${company.id}/hierarchies/ghq/remove`,
      })
    }

    return listItem
  }
}

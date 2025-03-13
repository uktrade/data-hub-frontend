import urls from '../../../lib/urls'

export const localNavItems = (companyId) => {
  return [
    {
      path: 'overview',
      url: urls.companies.overview.index(companyId),
      label: 'Overview',
      permissions: ['company.view_contact'],
    },
    {
      path: 'activity',
      url: urls.companies.activity.index(companyId),
      label: 'Activity',
      search: '',
      permissions: ['interaction.view_all_interaction'],
    },
    {
      path: 'business-details',
      url: urls.companies.businessDetails(companyId),
      label: 'Details',
    },
    {
      path: 'contacts',
      url: urls.companies.contacts(companyId),
      label: 'Contacts',
      search: '?archived%5B0%5D=false&sortby=modified_on%3Adesc&page=1',
      permissions: ['company.view_contact'],
      ariaDescription: 'Company contacts',
    },
    {
      path: 'files',
      url: urls.companies.files(companyId),
      label: 'Files',
      ariaDescription: 'Files',
    },
    {
      path: 'account-management',
      url: urls.companies.accountManagement.index(companyId),
      label: 'Account management',
      ariaDescription: 'Account management',
    },
    {
      path: 'investments',
      url: urls.companies.investments.companyInvestmentProjectsWithSearch(
        companyId
      ),
      label: 'Investment',
      permissions: [
        'investment.view_all_investmentproject',
        'investment.view_associated_investmentproject',
      ],
      ariaDescription: 'Company investments',
    },
    {
      path: 'exports',
      url: urls.companies.exports.index(companyId),
      label: 'Export',
      permissions: ['company.view_companyexportcountry'],
    },
    {
      path: 'orders',
      url: urls.companies.orders(companyId),
      label: 'Orders',
      permissions: ['order.view_order'],
      ariaDescription: 'Company orders',
    },
  ]
}

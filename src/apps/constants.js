const config = require('../../config')

const GLOBAL_NAV_ITEMS = [
  {
    path: '/companies',
    label: 'Companies',
    permissions: [
      'company.read_company',
    ],
  },
  {
    path: '/contacts',
    label: 'Contacts',
    permissions: [
      'company.read_contact',
    ],
  },
  {
    path: '/events',
    label: 'Events',
    permissions: [
      'event.read_event',
    ],
  },
  {
    path: '/interactions',
    label: 'Interactions and services',
    permissions: [
      'interaction.read_all_interaction',
    ],
  },
  {
    path: '/investment-projects',
    label: 'Investment projects',
    permissions: [
      'investment.read_associated_investmentproject',
      'investment.read_all_investmentproject',
    ],
  },
  {
    path: '/omis',
    label: 'Orders (OMIS)',
    permissions: [
      'order.read_order',
    ],
  },
  {
    path: config.performanceDashboardsUrl,
    label: 'MI dashboards',
  },
]

module.exports = {
  GLOBAL_NAV_ITEMS,
}

const ENTITIES = [
  {
    entity: 'company',
    path: 'companies',
    text: 'Companies',
    noun: 'company',
    count: 0,
    permissions: [
      'company.read_company',
    ],
  },
  {
    entity: 'contact',
    path: 'contacts',
    text: 'Contacts',
    noun: 'contact',
    count: 0,
    permissions: [
      'company.read_contact',
    ],
  },
  {
    entity: 'event',
    path: 'events',
    text: 'Events',
    noun: 'event',
    count: 0,
    permissions: [
      'event.read_event',
    ],
  },
  {
    entity: 'interaction',
    path: 'interactions',
    text: 'Interactions',
    noun: 'interaction',
    count: 0,
    permissions: [
      'interaction.read_all_interaction',
    ],
  },
  {
    entity: 'investment_project',
    path: 'investment-projects',
    text: 'Investment projects',
    noun: 'investment project',
    count: 0,
    permissions: [
      'investment.read_associated_investmentproject',
      'investment.read_all_investmentproject',
    ],
  },
  {
    entity: 'order',
    path: 'omis',
    text: 'Orders',
    noun: 'order',
    count: 0,
    permissions: [
      'order.read_order',
    ],
  },
]

module.exports = {
  ENTITIES,
}

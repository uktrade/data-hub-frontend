module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'company',
  },
  '/company': {
    heading: 'Choose the company',
    backLink: null,
    editable: true,
    next: 'contact',
    fields: ['company'],
  },
  '/contact': {
    heading: 'Choose the contact at the company',
    editable: true,
    next: 'market',
    fields: ['contact'],
  },
  '/market': {
    heading: 'Choose the country (market) of interest',
    editable: true,
    next: 'sector',
  },
  '/sector': {
    heading: 'Choose the sector',
    editable: true,
    next: 'confirm',
    fields: ['use_sector_from_company', 'sector'],
  },
  '/confirm': {
    heading: 'Check order details',
    backLink: null,
  },
}

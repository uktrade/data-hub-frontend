const {
  CompanyController,
  ContactController,
  MarketController,
  SectorController,
  ConfirmController,
} = require('./controllers')

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
    controller: CompanyController,
    templatePath: 'omis/apps/create/views',
    template: 'company--search',
  },
  '/contact': {
    heading: 'Choose the contact at the client company',
    editable: true,
    next: 'market',
    fields: ['contact'],
    controller: ContactController,
    templatePath: 'omis/apps/create/views',
    template: 'contact',
  },
  '/market': {
    heading: 'Market (country) of interest',
    editable: true,
    next: 'sector',
    fields: ['primary_market'],
    controller: MarketController,
  },
  '/sector': {
    heading: 'Choose the sector',
    editable: true,
    next: 'confirm',
    fields: ['use_sector_from_company', 'sector'],
    controller: SectorController,
    templatePath: 'omis/apps/create/views',
    template: 'sector',
  },
  '/confirm': {
    heading: 'Check order details',
    backLink: null,
    templatePath: 'omis/apps/create/views',
    template: 'summary',
    controller: ConfirmController,
  },
}

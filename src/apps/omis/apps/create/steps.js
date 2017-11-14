const {
  ClientDetailsController,
  MarketController,
  SectorController,
  ConfirmController,
} = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    skip: true,
    next: 'client-details',
  },
  '/client-details': {
    heading: 'Choose the contact at the client company',
    backLink: null,
    editable: true,
    next: 'market',
    fields: ['company', 'contact'],
    controller: ClientDetailsController,
    templatePath: 'omis/apps/create/views',
    template: 'client-details',
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

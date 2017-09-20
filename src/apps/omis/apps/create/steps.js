const {
  SubscribersController,
  ClientDetailsController,
  MarketController,
  ConfirmController,
} = require('./controllers')

module.exports = {
  '/': {
    entryPoint: true,
    resetJourney: true,
    next: 'client-details',
    templatePath: 'omis/apps/create/views',
    template: 'start',
  },
  '/client-details': {
    heading: 'Client details',
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
    next: 'subscribers',
    fields: ['primary_market'],
    controller: MarketController,
  },
  '/subscribers': {
    heading: 'Advisers in the UK',
    editable: true,
    next: 'confirm',
    fields: ['subscribers'],
    controller: SubscribersController,
  },
  '/confirm': {
    heading: 'Check order details',
    backLink: null,
    templatePath: 'omis/apps/create/views',
    template: 'summary',
    controller: ConfirmController,
  },
}

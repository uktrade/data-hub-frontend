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
    backLink: null,
    editable: true,
    next: 'market',
    fields: ['company', 'contact'],
    controller: ClientDetailsController,
    templatePath: 'omis/apps/create/views',
    template: 'client-details',
  },
  '/market': {
    editable: true,
    next: 'subscribers',
    fields: ['primary_market'],
    controller: MarketController,
  },
  '/subscribers': {
    editable: true,
    next: 'confirm',
    fields: ['subscribers'],
    controller: SubscribersController,
  },
  '/confirm': {
    backLink: null,
    templatePath: 'omis/apps/create/views',
    template: 'summary',
    controller: ConfirmController,
  },
}

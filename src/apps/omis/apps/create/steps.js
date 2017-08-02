const {
  AssignItaController,
  CompanyDetailsController,
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
    controller: CompanyDetailsController,
  },
  '/market': {
    editable: true,
    next: 'assign-ita',
    fields: ['primary_market'],
    controller: MarketController,
  },
  '/assign-ita': {
    editable: true,
    next: 'confirm',
    fields: ['ita'],
    controller: AssignItaController,
  },
  '/confirm': {
    backLink: null,
    templatePath: 'omis/apps/create/views',
    template: 'summary',
    controller: ConfirmController,
  },
}

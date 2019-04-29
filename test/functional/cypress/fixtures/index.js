module.exports = {
  chCompany: {
    mercuryTradingLtd: require('./ch-company/mercury-trading-ltd'),
  },
  company: {
    archivedLtd: require('./company/archived-ltd.json'),
    dnbCorp: require('./company/dnb-corp.json'),
    lambdaPlc: require('./company/lambda-plc'),
    marsExportsLtd: require('./company/mars-exports-ltd'),
    minimallyMinimalLtd: require('./company/minimally-minimal-ltd'),
    oneListCorp: require('./company/one-list-corp.json'),
    venusLtd: require('./company/venus-ltd.json'),
    withContacts: require('./company/with-contacts.json'),
  },
  default: require('./default.json'),
  interaction: {
    interactionWithNoLink: require('./interaction/interaction-with-no-link.json'),
    interactionWithLink: require('./interaction/interaction-with-link.json'),
  },
  investment: {
    investmentWithNoLink: require('./investment/investment-with-no-link.json'),
    investmentWithLink: require('./investment/investment-with-link.json'),
  },
}

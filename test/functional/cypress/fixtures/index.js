module.exports = {
  company: {
    archivedLtd: require('./company/archived-ltd.json'),
    dnbCorp: require('./company/dnb-corp.json'),
    minimallyMinimalLtd: require('./company/minimally-minimal-ltd'),
    oneListCorp: require('./company/one-list-corp.json'),
    venusLtd: require('./company/venus-ltd.json'),
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

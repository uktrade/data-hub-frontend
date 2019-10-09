module.exports = {
  chCompany: {
    mercuryTradingLtd: require('./ch-company/mercury-trading-ltd'),
  },
  company: {
    archivedLtd: require('./company/archived-ltd.json'),
    dnbCorp: require('./company/dnb-corp.json'),
    dnbLtd: require('./company/dnb-ltd.json'),
    investigationLimited: require('./company/investigation-limited'),
    lambdaPlc: require('./company/lambda-plc'),
    marsExportsLtd: require('./company/mars-exports-ltd'),
    minimallyMinimalLtd: require('./company/minimally-minimal-ltd'),
    oneListCorp: require('./company/one-list-corp.json'),
    someOtherCompany: require('./company/some-other-company.json'),
    venusLtd: require('./company/venus-ltd.json'),
    withContacts: require('./company/with-contacts.json'),
  },
  contact: {
    deanCox: require('./contact/dean-cox'),
  },
  default: require('./default.json'),
  interaction: {
    cancelledMeeting: require('./interaction/cancelled-meeting'),
    draftFutureMeeting: require('./interaction/draft-future-meeting'),
    draftPastMeeting: require('./interaction/draft-past-meeting'),
    withNoLink: require('./interaction/with-no-link.json'),
    withLink: require('./interaction/with-link.json'),
  },
  investment: {
    investmentWithNoLink: require('./investment/investment-with-no-link.json'),
    investmentWithLink: require('./investment/investment-with-link.json'),
    newHotelFdi: require('./investment/new-hotel-fdi'),
  },
}

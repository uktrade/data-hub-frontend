module.exports = {
  chCompany: {
    mercuryTradingLtd: require('./ch-company/mercury-trading-ltd'),
  },
  company: {
    archivedLtd: require('../../../../test/sandbox/fixtures/v4/company/company-archived.json'),
    automaticallyArchivedLtd: require('../../../../test/sandbox/fixtures/v4/company/company-archived-automatically.json'),
    dnbCorp: require('../../../../test/sandbox/fixtures/v4/company/company-dnb-corp.json'),
    dnbLtd: require('../../../../test/sandbox/fixtures/v4/company/company-dnb-ltd.json'),
    dnbSubsidiary: require('../../../../test/sandbox/fixtures/v4/company/company-dnb-subsidiary.json'),
    dnbGlobalUltimate: require('../../../../test/sandbox/fixtures/v4/company/company-dnb-global-ultimate.json'),
    dnBGlobalUltimateAndGlobalHq: require('../../../../test/sandbox/fixtures/v4/company/company-dnb-global-ultimate-and-global-hq.json'),
    investigationLimited: require('../../../../test/sandbox/fixtures/v4/company/company-investigation-ltd.json'),
    lambdaPlc: require('../../../../test/sandbox/fixtures/v4/company/company-lambda-plc.json'),
    marsExportsLtd: require('../../../../test/sandbox/fixtures/v4/company/company-mars-exports-ltd.json'),
    minimallyMinimalLtd: require('../../../../test/sandbox/fixtures/v4/company/company-minimally-minimal.json'),
    oneListCorp: require('../../../../test/sandbox/fixtures/v4/company/company-one-list-corp.json'),
    someOtherCompany: require('../../../../test/sandbox/fixtures/v4/company/company-some-other-company.json'),
    venusLtd: require('../../../../test/sandbox/fixtures/v4/company/company-with-investment-1'),
    externalActivitiesLtd: require('../../../../test/sandbox/fixtures/v4/company/company-with-external-activities.json'),
    withContacts: require('../../../../test/sandbox/fixtures/v4/company/company-with-contacts.json'),
    oneListTierDita: require('../../../../test/sandbox/fixtures/v4/company/company-one-list-tier-d-ita.json'),
    addInteractionError: require('../../../../test/sandbox/fixtures/v4/company/company-validation-error.json'),
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
    withReferral: require('../../../sandbox/fixtures/v3/interaction/interaction-with-referral.json'),
  },
  investment: {
    investmentWithNoLink: require('./investment/investment-with-no-link.json'),
    investmentWithLink: require('./investment/investment-with-link.json'),
    newHotelFdi: require('./investment/new-hotel-fdi'),
    stageWon: require('./investment/investment-stage-won.json'),
  },
  event: {
    oneDayExhibition: require('./event/one-day-exhibition'),
    teddyBearExpo: require('./event/teddy-bear-expo'),
  },
  export: {
    historyWithInteractions: require('../../../sandbox/fixtures/v4/export/history-with-interactions.json'),
  },
  omis: {
    cancelledOrder: require('../../../sandbox/fixtures/v3/omis/cancelled-order.json'),
    draftOrder: require('../../../sandbox/fixtures/v3/omis/draft-order.json'),
    paidOrder: require('../../../sandbox/fixtures/v3/omis/paid-order.json'),
  },
  referrals: {
    referalDetails: require('../../../sandbox/fixtures/v4/referrals/referral-details.json'),
  },
}

module.exports = {
  company: {
    venusLtd: require('./company/venus-ltd'),
    lambdaPlc: require('./company/lambda-plc'),
    oneListCorp: require('./company/one-list-corp'),
    archivedLtd: require('./company/archived-ltd'),
    teddyBearExpo: require('./company/teddy-bear-expo'),
    emptyUkRegionLtd: require('./company/empty-uk-region-ltd.json'),
    create: require('./company/create-company'),
  },
  contact: {
    johnnyCakeman: require('./contact/johnny-cakeman'),
    deanCox: require('./contact/dean-cox'),
    create: require('./contact/create-contact').create,
  },
  investmentProject: {
    newHotelFdi: require('./investment-project/new-hotel-fdi'),
    newHotelCommitmentToInvest: require('./investment-project/new-hotel-commitment-to-invest'),
    fancyDressManufacturing: require('./investment-project/fancy-dress-manufacturing'),
    newGolfCourse: require('./investment-project/new-golf-course'),
    newZoo: require('./investment-project/new-zoo'),
    create: require('./investment-project/create-investment').create,
  },
  event: {
    create: require('./create-event'),
  },
}

module.exports = () => {
  return {
    metaList: '[data-test="metaList"]',
    companyName: '[data-test="heading"]',
    address: '[data-test="address"]',
    badge: '[data-test="badge"]',
    description: {
      paragraph: (number) => `[data-test="description"] p:nth-child(${number})`,
    },
    archivedMessage: '[data-test="archivedMessage"]',
    investigationMessage: '[data-test="investigationMessage"]',
    accountPlanMessage: '[data-test="accountPlanMessage"]',
    flashMessageList: '[data-test="flash"]',
  }
}

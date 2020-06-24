module.exports = () => {
  return {
    metaList: '[data-auto-id="metaList"]',
    companyName: '[data-auto-id="heading"]',
    address: '[data-auto-id="address"]',
    badge: '[data-auto-id="badge"]',
    description: {
      paragraph: (number) =>
        `[data-auto-id="description"] p:nth-child(${number})`,
    },
    archivedMessage: '[data-auto-id="archivedMessage"]',
    investigationMessage: '[data-auto-id="investigationMessage"]',
    accountPlanMessage: '[data-auto-id="accountPlanMessage"]',
    flashMessageList: '[data-auto-id="flash"]',
  }
}

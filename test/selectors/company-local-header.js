module.exports = () => {
  return {
    metaList: '[data-test="metaList"]',
    companyName: '[data-test="heading"]',
    address: '[data-test="address"]',
    relatedCompaniesLink: '[data-test="company-tree-link"]',
    badge: '[data-test="badge"]',
    description: {
      paragraph: (number) => `[data-test="description"] p:nth-child(${number})`,
    },
    archiveMessage: '[data-test="archive-message"]',
    archiveReason: '[data-test="archive-reason"]',
    unarchiveButton: '[data-test="unarchive-link"]',
    investigationMessage: '[data-test="investigationMessage"]',
    accountPlanMessage: '[data-test="accountPlanMessage"]',
    flashMessageList: '[data-test="flash"]',
  }
}

module.exports = () => {
  return {
    hierarchy: '[data-test="businessHierarchyDetailsContainer"]',
    unarchiveLink: '[data-auto-id="bodyMainContent"] .c-message a',
    whereDoesInformation: '[data-test="businessDetailsWhereDoesInformation"]',
    address: (cellNumber) => {
      const cellSelector = `[data-test="addressesDetailsContainer"] tr td:nth-child(${cellNumber})`
      return {
        badge: (badgeNumber) => {
          return `${cellSelector} div div:nth-child(${badgeNumber}) span.c-badge`
        },
        line: (lineNumber) => {
          return `${cellSelector} ul li:nth-child(${lineNumber})`
        },
      }
    },
  }
}

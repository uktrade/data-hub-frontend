module.exports = () => {
  return {
    hierarchy: '[data-auto-id="businessHierarchyDetailsContainer"]',
    unarchiveLink: '[data-auto-id="bodyMainContent"] .c-message a',
    whereDoesInformation:
      '[data-auto-id="businessDetailsWhereDoesInformation"]',
    address: (cellNumber) => {
      const cellSelector = `[data-auto-id="addressesDetailsContainer"] tr td:nth-child(${cellNumber})`
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

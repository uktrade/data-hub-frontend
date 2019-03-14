module.exports = () => {
  return {
    unarchiveLink: '[data-auto-id="businessDetailsUnarchive"]',
    whereDoesInformation: '[data-auto-id="businessDetailsWhereDoesInformation"]',
    address: (cellNumber) => {
      const cellSelector = `[data-auto-id="businessDetailsAddress"] td:nth-child(${cellNumber})`
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

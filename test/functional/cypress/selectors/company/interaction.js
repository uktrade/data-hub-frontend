module.exports = () => {
  const bodyMainContentSelector = '[data-auto-id="bodyMainContent"]'

  return {
    heading: `${bodyMainContentSelector} h2`,
    addButton: (companyId) => `${bodyMainContentSelector} [href="/companies/${companyId}/interactions/create"]`,
    archivedSummary: `${bodyMainContentSelector} .details__summary`,
    timelineLink: (companyId) => `${bodyMainContentSelector} [href="/companies/${companyId}/timeline"]`,
  }
}

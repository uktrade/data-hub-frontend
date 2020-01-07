module.exports = () => {
  const bodyMainContentSelector = '[data-auto-id="bodyMainContent"]'

  return {
    interaction: {
      addButton: (companyId) =>
        `${bodyMainContentSelector} [href="/companies/${companyId}/interactions/create"]`,
    },
    contact: {
      addButton: (companyId) =>
        `${bodyMainContentSelector} [href="/contacts/create?company=${companyId}"]`,
    },
    export: {
      editButton: (companyId) =>
        `${bodyMainContentSelector} [href="/companies/${companyId}/exports/edit"]`,
    },
    heading: `${bodyMainContentSelector} h2`,
    archivedSummary: `${bodyMainContentSelector} .details__summary`,
  }
}

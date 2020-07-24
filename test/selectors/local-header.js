module.exports = () => {
  const localHeaderSelector = '[data-auto-id="localHeader"]'
  return {
    metaList: `${localHeaderSelector} .c-meta-list`,
    heading: `${localHeaderSelector} h1`,
    headingAfter: `${localHeaderSelector} p`,
    badge: (number) =>
      `${localHeaderSelector} span.c-badge:nth-child(${number})`,
    description: {
      paragraph: (number) =>
        `${localHeaderSelector} .c-local-header__description p:nth-child(${number})`,
    },
    viewFullBusinessDetailsLink: (companyId) =>
      `${localHeaderSelector} [href="/companies/${companyId}/business-details"]`,
    flash: '.c-message',
  }
}

module.exports = () => {
  const localHeaderSelector = '[data-auto-id="localHeader"]'
  return {
    heading: `${localHeaderSelector} h1.c-local-header__heading`,
    headingAfter: `${localHeaderSelector} p.c-local-header__heading-after`,
    badge: (number) => `${localHeaderSelector} span.c-badge:nth-child(${number})`,
    description: {
      paragraph: (number) => `${localHeaderSelector} .c-local-header__description p:nth-child(${number})`,
    },
    viewFullBusinessDetailsLink: (companyId) => `${localHeaderSelector} [href="/companies/${companyId}/business-details"]`,
    flash: '.c-message',
  }
}

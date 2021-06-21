module.exports = () => {
  return {
    whyArchived: '[data-test="subsidiariesWhyArchived"]',
    linkASubsidiary: '[data-test="Link a subsidiary"]',
    edit: '[data-test="businessHierarchyDetailsContainer"] a:contains("Edit")',
    oneLinkedSubsidiary: 'a:contains("1 subsidiary")',
    linkASubsidiaryToHierarchy: 'a:contains("Link a subsidiary")',
    whyNoSubLink: 'span:contains("Why can I not link a subsidiary?")',
  }
}

import urls from '../../../lib/urls'

/**
 * Checks if a company is in the D tier on the one list.
 */
export const isItaTierDAccount = (oneListGroupTier) =>
  oneListGroupTier &&
  oneListGroupTier.id === '1929c808-99b4-4abf-a891-45f2e187b410'

/**
 * Generates the breadcrumbs for company pages
 */
export const buildCompanyBreadcrumbs = (
  pageBreadcrumbs,
  companyId,
  companyName
) => {
  const initalBreadcrumbs = [
    { link: urls.dashboard(), text: 'Home' },
    {
      link: urls.companies.index(),
      text: 'Companies',
    },
    { link: urls.companies.detail(companyId), text: companyName },
  ]
  return initalBreadcrumbs.concat(pageBreadcrumbs)
}
